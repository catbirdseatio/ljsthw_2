import spectrum from "csv-spectrum";
import csv from "neat-csv";
import equal from "deep-equal";
import { parse } from "./parser.js";

const simple_parse = (raw_csv) => {
  const rows = raw_csv.split("\n");
  const result = [];

  for(let row of rows) {
    result.push(row.split(','));
  }

  return result;
}

spectrum(async (err, samples) => {
  for(let sample of samples) {
    const raw_csv = sample.csv.toString();
    const good = await csv(raw_csv);
    // const ours = simple_parse(raw_csv);
    const ours = parse(raw_csv);

    if(!equal(ours, good)) {
      console.error("FAIL EXPECTED", good, "\nGOT", ours);
      process.exit(1);
    }
  }
});
