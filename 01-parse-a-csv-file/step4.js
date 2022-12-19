import spectrum from "csv-spectrum";
import { parseString } from "fast-csv";
import test from "ava";

const simple_parse = (raw_csv) => {
  const rows = raw_csv.split("\n");
  const result = [];

  for(let row of rows) {
    result.push(row.split(','));
  }

  return result;
}

test('failing spectrum samples match', async t => {
  spectrum(async (err, samples) => {
    for(let sample of samples) {
      const raw_csv = sample.csv.toString();
      const ours = simple_parse(raw_csv);

      parseString(raw_csv)
        .on('error', t.fail())
        .on('data', row => good.push(row))
        .on('end', rowCount => {
          if(!equal(ours, good)) {
            console.error("FAIL EXPECTED", good, "\nGOT", ours);
            process.exit(1);
          }
      });
    }
  });
})
