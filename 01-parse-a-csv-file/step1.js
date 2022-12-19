import spectrum from "csv-spectrum";
import csv from "neat-csv";
import { parse } from "./parser.js";


spectrum(async (err, samples) => {
  for (let sample of samples) {
    const raw_csv = sample.csv.toString();
    console.log("RAW CSV:\n", raw_csv);

    const parsed = await csv(raw_csv);
    let new_school_parsed_array = parse(raw_csv);
    console.log("PARSED:\n", parsed);
    console.log("NEW SCHOOL PARSED:", new_school_parsed_array);
  }
});
