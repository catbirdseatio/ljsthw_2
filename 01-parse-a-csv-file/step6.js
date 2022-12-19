import spectrum from "csv-spectrum";
import { parseString } from "fast-csv";
import { promisify } from "util";
import { parse_to_2d_array } from "./parser.js";
import test from "ava";

const simple_parse = (raw_csv) => {
  const rows = raw_csv.split("\n");
  const result = [];

  for(let row of rows) {
    result.push(row.split(','));
  }

  return result;
}

const spectrum_samples = promisify(spectrum);

test('spectrum samples match', async t => {
  const samples = await spectrum_samples();

  for(let sample of samples) {
    const raw_csv = sample.csv.toString();
    const good = [];

    const count = await new Promise((res, rej) => {
      parseString(raw_csv)
        .on('error', err => rej(err))
        .on('data', row => good.push(row))
        .on('end', rowCount => res(rowCount));
    });

    const ours = parse_to_2d_array(raw_csv);

    // using t.is(): 'Values are deeply equal to each other, but they are not the same'
    // t.is(ours, good);

    t.deepEqual(ours, good);
  }
})
