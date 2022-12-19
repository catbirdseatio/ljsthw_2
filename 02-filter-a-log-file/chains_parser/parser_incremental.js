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
  .option("--format <String>", "Output format, text or json. Ignores min for raw output.")
  .option("--outfile <String>", "Save to file rather than stdout.")
  .option("--results <file>", "Save/load incremental results here.")
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

      // skip lines that have content we don't care about
      if(data.url.match(skip)) continue;

      // convert the date to a only day length
      const date_key = format(data.time, "yyyy-MM-dd");

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

const construct_request_chains = (ip_chains, by_ip, domain) => {
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

const sort_request_chains = (chains) => {
  const converted = [];

  for(let [url, stats] of Object.entries(chains)) {
    if(stats.comes_from) {
      converted.push([stats.count, `[${stats.comes_from}] ${stats.full_chain.join(' ')}`]);
    } else {
      converted.push([stats.count, `${stats.full_chain.join(' ')}`]);
    }
  }

  return converted.sort((a, b) => b[0] - a[0]);
}

const output_report = async (stats, data, min) => {
  for(let key in data) {
    console.log(`--- ${key} ---`);
    const chains_sorted = data[key];

    for(let [count, url] of chains_sorted) {
      if(count < min) continue; // skip below min

      console.log(count, url);
    }
  }
}

const output_json = async (stats, result, min, outfile) => {
  if(outfile) {
    const fd = fs.openSync(outfile, "w+");
    const data = {stats, result, generated_on: new Date()};
    const bytes = fs.writeSync(fd, Buffer.from(JSON.stringify(data, null, 4)), 0);
    fs.closeSync(fd);
  } else {
    console.log({stats, result});
  }
}

const construct_chains = (result, by_date, domain, min) => {
  // first go through the new entries and get chains
  for(let key in by_date) {
    const ip_chains = result[key] || {}; // get the chains to update
    const chains = construct_request_chains(ip_chains, by_date[key], domain);

    result[key] = ip_chains; // store them for later
  }

  const sorted = {};

  // now result has the previous and current results, sort them
  for(let key in result) {
    sorted[key] = sort_request_chains(result[key], min);
  }

  return sorted;
}

const load_result = (results_file) => {
  if(OPTS.results && fs.existsSync(results_file)) {
    return JSON.parse(fs.readFileSync(results_file));
  } else {
    return {};
  }
}

const save_result = (results, results_file) => {
  fs.writeFileSync(results_file, JSON.stringify(results, null, 4));
}


const [by_date, stats] = await parse_logs_glob(OPTS.input, OPTS.errors);

const results = load_result(OPTS.results);

const chains_by_date = construct_chains(results, by_date, OPTS.domain, OPTS.min);

if(OPTS.format === "json") {
  output_json(stats, chains_by_date, OPTS.outfile);
} else {
  output_report(stats, chains_by_date, OPTS.min);
}

if(OPTS.results) save_result(results, OPTS.results);

console.log(stats);
