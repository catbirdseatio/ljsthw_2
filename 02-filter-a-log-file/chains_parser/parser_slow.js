import fs from "fs";
import assert from "assert";
import UAParser from "ua-parser-js";
import readline from "readline";
import { program } from "commander";

class Parser {
  constructor() {
    this.text = "";
    this.next = "";
  }

  match(reg, consume=true) {
    const n = this.next.match(reg);

    if(n === null) {
      return undefined;
    } else {
      const element = n.length > 1 ? n.slice(1) : n[0];

      if(consume) {
        this.next = this.next.slice(n[0].length);
      }

      return element;
    }
  }

  start(line) {
    this.text = line;
    this.next = line;
  }

  ws(consume=true) {
    return this.match(/ +/, consume);
  }

  parse_new_log(ip) {
    const [port, conn_id, conn_count] = this.match(/^([0-9]+):([0-9]+):([0-9]+)/);

    this.ws();

    const [ time ] = this.match(/\[(.*)\]/);

    this.ws();

    const [ full_url ] = this.match(/"(.+?)"/);

    const [url, params] = full_url.split("?");

    this.ws();

    const code = this.match(/\-|[0-9]+/);

    this.ws();

    const bytes = this.match(/\-|[0-9]+/);

    this.ws();

    const [refer] = this.match(/"(.+?)"/);

    this.ws();

    const [ua] = this.match(/"(.+?)"/);

    return {
      ip,
      conn_id: parseInt(conn_id),
      conn_count: parseInt(conn_count),
      time: new Date(time),
      url, params,
      code: parseInt(code),
      size: parseInt(bytes),
      refer: refer === '-' ? undefined : refer,
      ua: UAParser(ua)
    };
  }

  parse_old_log(ip) {
    this.match(/- -/);

    this.ws();

    // FORMAT: 29/Mar/2022:22:40:52 +0200
    const [ day, month, year, hour, minute, seconds, tz_offset ] = this.match(/\[([0-9]+)\/([A-Za-z]+)\/([0-9]+):([0-9]+):([0-9]+):([0-9]+) (.+?)\]/);

    this.ws();

    const [ method, full_url, http_version ] = this.match(/"([A-Z]+) (.+) HTTP\/([0-9].[0-9])"/);

    const [ url, params ] = full_url.split("?");

    this.ws();

    const code = this.match(/\-|[0-9]+/);

    this.ws();

    const bytes = this.match(/\-|[0-9]+/);

    this.ws();

    const [refer] = this.match(/"(.+?)"/);

    this.ws();

    const [ua] = this.match(/"(.+?)"/);

    // this is another IP address sometimes in another log format that I'll ignore
    const unknown = this.match(/".+?"$/);

    return {
      ip,
      method,
      http_version,
      time: new Date(`${day} ${month} ${year} ${hour}:${minute}:${seconds} ${tz_offset}`),
      url, params,
      code: parseInt(code),
      size: parseInt(bytes),
      refer: refer === '-' ? undefined : refer,
      ua: UAParser(ua)
    };
  }

  parse() {
    const ip = this.match(/^[0-9\.]+/);
    const test = this.match(/(:| )/);

    // BUG: uhh for some reason it needs == here? === says : doesn't equal :
    if(test == ":") {
      return this.parse_new_log(ip);
    } else if(test == " ") {
      return this.parse_old_log(ip);
    } else {
      // console.log(`PARSE ERROR, expected : or ' ' but got ${test}`);
      return {};
    }
  }
}

const parse_logs = async (file_name, errors) => {
  const read_stream = fs.createReadStream(file_name);

  const rl = readline.createInterface({
    input: read_stream,
    crlfDelay: Infinity
  });

  const parser = new Parser();

  const stats = {
    lines: 0,
    chains: 0,
    excluded: 0,
    errors: 0,
    roots: 0,
    firsts: 0
  };

  const skip = /(authcheck|.*\.svg|.*\.webmanifest|.*\.js|.*\.css|.*php|socket\.io|\.env|.*\.png|.*\.txt|.*\.woff|.*\.jpg|.*\.mp4|.*\.torrent|\-|.*\.ico|\/api\/.*\?.*|.*\.html|.*\.map|.*.php)/

  const by_ip = {};

  for await (let line of rl) {
    try {
      stats.lines += 1;
      parser.start(line);

      const data = parser.parse();

      // skip lines that have content we don't care about
      if(data.url.match(skip)) continue;

      // store or update the chain in the by_ip chain
      const ip_chain = by_ip[data.ip] || [];

      ip_chain.push(data);

      by_ip[data.ip] = ip_chain;
    } catch(error) {
      if(errors) console.error(error);

      stats.errors += 1;
    }
  }

  return [by_ip, stats];
}

const chain_to_set = (requests) => {
  const path = new Set();

  for(let r of requests) {
    path.add(r.url);
  }

  return path.values();
}

const chain_to_list = (requests) => {
  const path = [];
  let seen;

  for(let r of requests) {
    if(r.url != seen) {
      path.push(r.url);
      seen = r.url;
    }
  }

  return path.values();
}

const sort_request_chains = (by_ip, as_set) => {
  let ip_chains = {};
  let seen;

  for(let [ip, requests] of Object.entries(by_ip)) {
    const chain = as_set ? chain_to_set(requests) : chain_to_list(requests);

    const ref = requests[0].refer ? `[${requests[0].refer}]` : "";
    const url_set = [ref, ...chain].join(" ");

    ip_chains[url_set] = url_set in ip_chains ? ip_chains[url_set] + 1 : 1;
  }

  const chains_sorted = Object.entries(ip_chains);
  chains_sorted.sort((a, b) => b[1] - a[1]);

  return chains_sorted;
}

const output_results = (min, chains_sorted) => {
  for(let [url, count] of chains_sorted) {
    if(count >= min) {
      console.log(count, url);
    }
  }

  console.log(stats);
}

program
  .option("--no-set", "Use a Set instead of a list for chains.")
  .option("--min <Number>", "The lowest count to print. Stop at this.", 1)
  .option("--errors", "Show the erorrs so you can fix them.", false)
  .requiredOption("--input <String>", "Input file.")
  .description("Processes different web server logs to determine request chain frequency.")
  .version(0.1);

program.parse();
const OPTS = program.opts();
OPTS.min = parseInt(OPTS.min);

assert(!isNaN(OPTS.min), `min must be a number, you have ${OPTS.min}`);

const [by_ip, stats] = await parse_logs(OPTS.input, OPTS.errors);
const chains_sorted = sort_request_chains(by_ip, OPTS.set);
output_results(OPTS.min, chains_sorted);
