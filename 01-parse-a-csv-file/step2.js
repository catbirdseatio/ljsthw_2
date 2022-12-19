import spectrum from "csv-spectrum";

/*
 * A naive CVS parser to start comparing with the existing neat-csv
 * parser.  This wrong for many CSV inputs, but you'll take this and
 * work to make it behave as well as the neat-csv parser.
 */
const simple_parse = (raw_csv) => {
  const rows = raw_csv.split("\n");
  const result = [];

  for(let row of rows) {
    result.push(row.split(','));
  }

  return result;
}


spectrum((err, samples) => {
  for(let sample of samples) {
    const raw_csv = sample.csv.toString();
    console.log("RAW CSV:\n", raw_csv);

    const parsed = simple_parse(raw_csv);
    console.log("PARSED:\n", parsed);
  }
});
