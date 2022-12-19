import fs from "fs";
import assert from "assert";
import readline from "readline";
import { program } from "commander";
import glob from "fast-glob";
import format from "date-fns/format/index.js";
import asciichart from "asciichart";

program
  .option("--min <Number>", "The lowest count to print. Stop at this.", 1)
  .option("--errors", "Show the errors so you can fix them.", false)
  .option("--outfile <String>", "Save to file rather than stdout.")
  .option("--max-days <int>", "Only display charts for entries with at least this many days.", 10)
  .option("--height <int>", "Height of the ascii graph.", 5)
  .requiredOption("--input <String>", "Input file glob.")
  .description("Loads the output of a chain parser and produces a report.")
  .version(0.1);

program.parse();
const OPTS = program.opts();
OPTS.min = parseInt(OPTS.min);
assert(!isNaN(OPTS.min), `min must be a number, you have ${OPTS.min}`);

OPTS.height = parseInt(OPTS.height);
assert(!isNaN(OPTS.height), `height must be a number, you have ${OPTS.height}`);


const sort_request_chains = (chains, min) => {
  const converted = [];

  for(let [url, stats] of Object.entries(chains)) {
    if(stats.count < min) continue; // skip below min

    if(stats.comes_from) {
      converted.push([stats.count, `[${stats.comes_from}] ${stats.full_chain.join(' ')}`]);
    } else {
      converted.push([stats.count, `${stats.full_chain.join(' ')}`]);
    }
  }

  return converted.sort((a, b) => b[0] - a[0]);
}

const { stats, domain, result, generated_on} = JSON.parse(fs.readFileSync(OPTS.input));

const sorted = [];
const keys = Object.keys(result).sort();

const by_chain = {};

for(let key of keys) {
  const chain = sort_request_chains(result[key], OPTS.min);

  for(let [count, urls] of chain) {
    const series = by_chain[urls] || [];
    series.push(count);
    by_chain[urls] = series;
  }
}

console.log("FROM", keys[0], "TO", keys[keys.length - 1]);

for(let [chain, counts] of Object.entries(by_chain)) {
  if(counts.length > OPTS.maxDays) {
    console.log(chain);
    console.log(asciichart.plot(counts, {height: OPTS.height}));
  }
}
