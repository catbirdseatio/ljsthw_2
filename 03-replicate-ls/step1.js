import path from "path";
import glob from "fast-glob";
import { program } from "commander";

program
  .name("ls")
  .description("ls replica")
  .option("-l");

program.parse();

const options = program.opts();


if(program.args.length > 0) {
  const results = glob.sync(program.args[0]);

  for(let result of results) {
    console.log(result);
  }
}
