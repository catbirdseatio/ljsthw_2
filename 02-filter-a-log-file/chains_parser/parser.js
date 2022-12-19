import fs from "fs";
import assert from "assert";
import UAParser from "ua-parser-js";
import readline from "readline";
import { program } from "commander";
import glob from "fast-glob";
import format from "date-fns/format/index.js";

program
  .option("--min <Number>", "The lowest count to print. Stop at this.", 1)
  .option("--errors", "Show the errors so you can fix them.", false)
  .requiredOption("--output <String>", "Save to file rather than stdout.")
  .requiredOption("--domain <String>", "Domain for the log. Gets removed as a refer.")
  .requiredOption("--input <String>", "Input file glob.")
  .description("Processes different web server logs to determine request chain frequency.")
  .version(0.1);

program.parse();
const OPTS = program.opts();
OPTS.min = parseInt(OPTS.min);
assert(!isNaN(OPTS.min), `min must be a number, you have ${OPTS.min}`);


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

const parse_log_file = async (results, stats, file_name, errors) => {
  const read_stream = fs.createReadStream(file_name);

  const rl = readline.createInterface({
    input: read_stream,
    crlfDelay: Infinity
  });

  const parser = new Parser();

  const skip = /(authcheck|.*\.svg|.*\.webmanifest|.*\.js|.*\.css|.*php|socket\.io|\.env|.*\.png|.*\.txt|.*\.woff|.*\.jpg|.*\.mp4|.*\.torrent|\-|.*\.ico|\/api\/.*\?.*|.*\.html|.*\.map|.*.php)/

  for await (let line of rl) {
    try {
      stats.lines += 1;
      parser.start(line);

      const data = parser.parse();
      // convert the date to a only day length
      const date_key = format(data.time, "yyyy-MM-dd");

      // skip lines that have content we don't care about
      if(data.url.match(skip)) {
        stats.excluded += 1;
        continue;
      }

      // get the date entry or a new one
      const date_entry = results[date_key] || {};

      // store or update the chain in the by_ip chain
      const ip_chain = date_entry[data.ip] || [];
      ip_chain.push(data);
      date_entry[data.ip] = ip_chain;

      // and update this date entry
      results[date_key] = date_entry;

    } catch(error) {
      if(errors) console.error(error);

      stats.errors += 1;
    }
  }
}

const parse_logs_glob = async (file_glob, errors) => {
  const file_list = glob.sync(file_glob);
  const results = {};
  const stats = {
    lines: 0,
    chains: 0,
    excluded: 0,
    errors: 0,
    roots: 0,
    firsts: 0
  };

  for(let file_name of file_list) {
    await parse_log_file(results, stats, file_name, errors);
  }

  return [results, stats];
}

const chain_to_set = (requests) => {
  const path = new Set();

  for(let r of requests) {
    path.add(r.url);
  }

  return path.values();
}

const construct_url_set = (domain, ref, full_chain) => {
  // this tags the chains with refer using [ref]
  if(ref && !ref.includes(domain)) {
    return [`[${ref}]`, ...full_chain.slice(1)].join(" ");
  } else {
    return full_chain.join(" ");
  }
}

const construct_request_chains = (by_ip, domain) => {
  let ip_chains = {};

  for(let [ip, requests] of Object.entries(by_ip)) {
    const chain = chain_to_set(requests);

    // record the initial refer to track entry to the site
    const ref = requests[0].refer;
    const full_chain = [...chain];
    const url_set = construct_url_set(domain, ref, full_chain);

    // using url as key to count,full_chain
    if(url_set in ip_chains) {
      ip_chains[url_set].count += 1;
    } else {
      ip_chains[url_set] = { count: 1, comes_from: ref, full_chain};
    }
  }

  return ip_chains;
}

const output_json = async (stats, data, domain, min, outfile) => {
  const result = {};

  for(let key in data) {
    result[key] = construct_request_chains(data[key], domain);
  }

  const fd = fs.openSync(outfile, "w+");
  const output = {stats, domain, result, generated_on: new Date()};
  const bytes = fs.writeSync(fd, Buffer.from(JSON.stringify(output)), 0);
  fs.closeSync(fd);
}


const [by_date, stats] = await parse_logs_glob(OPTS.input, OPTS.errors);

output_json(stats, by_date, OPTS.domain, OPTS.min, OPTS.output);

console.log(stats);
