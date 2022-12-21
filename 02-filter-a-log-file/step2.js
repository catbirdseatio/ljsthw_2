import fs from "fs";

// Get a file and a pattern from argv
const raw_log = fs.readFileSync(process.argv[2]).toString().split("\n");
const filter_pattern = new RegExp(process.argv[3], "g")

// Convert log into an array
let lines = raw_log
  .map((line) => {
    return line
      .split(/[-"]/gi)
      .map((element) => element.trim().replace(/["\[\]]/gi, ""))
      .filter((element) => element.trim() !== "");
  })
  .filter((item) => item.length !== 0);

// Filter with the regex; if match found, write out the raw line to the console
lines.forEach((line, index) => {
    const match = line.find(value => filter_pattern.test(value));
    if (match) console.log(raw_log[index]);
});
