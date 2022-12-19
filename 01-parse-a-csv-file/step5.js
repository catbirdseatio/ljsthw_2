import spectrum from "csv-spectrum";
import { parseString } from "fast-csv";
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

test('spectrum samples match', async t => {
  const samples = await new Promise((res, rej) => {
    spectrum((err, samples) => res(samples));
  });

  for(let sample of samples) {
    const raw_csv = sample.csv.toString();
    const good = [];

    const count = await new Promise((res, rej) => {
      parseString(raw_csv)
        .on('error', err => rej(err))
        .on('data', row => good.push(row))
        .on('end', rowCount => res(rowCount));
    });

    // parse_to_2d_array
    const ours = parse_to_2d_array(raw_csv);

    t.deepEqual(ours, good);
  }
})
