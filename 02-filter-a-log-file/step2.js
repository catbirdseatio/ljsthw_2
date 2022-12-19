import fs from "fs";

const raw_log = fs.readFileSync(process.argv[2]);

const lines = raw_log.toString().split("\n");

// now you have to figure out how to split each line of the
// web log into something meaningful
