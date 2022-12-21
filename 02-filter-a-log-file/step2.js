import fs from "fs";

const raw_log = fs.readFileSync(process.argv[2]);
const filter_pattern = new RegExp(process.argv[3], "g")

let lines = raw_log
  .toString()
  .split("\n")
  .map((line) => {
    return line
      .split(/[-"]/gi)
      .map((element) => element.trim().replace(/["\[\]]/gi, ""))
      .filter((element) => element.trim() !== "");
  })
  .filter((item) => item.length !== 0);

// now you have to figure out how to split each line of the
// web log into something meaningful
console.log(lines.forEach(line => {
    const match = line.find(value => filter_pattern.test(value));
    if (match) console.log(` - - [${line[0]}] "${line[1]}" ""${line[2]}" ${line[3]} ${line[4]} "${line[5]} ${line[6]}" -`);
}));
