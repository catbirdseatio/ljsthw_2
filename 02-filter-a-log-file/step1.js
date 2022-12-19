import fs from "fs";

const raw_log = fs.readFileSync(process.argv[2]);

const lines = raw_log.toString().split("\n");

const search = new RegExp(process.argv[3]);

// continue here, how do you find all the lines matching the regex?
// how complex can you make this?  Is it necessary?
