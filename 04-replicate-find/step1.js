import path from "path";
import glob from "fast-glob";
import { program } from "commander";

program
  .name("find")
  .description("find replica")
  .option("--name");

program.parse();

const options = program.opts();


if(program.args.length > 0) {
  const results = glob.sync(program.args[0]);

  for(let result of results) {
    console.log(result);
  }
}
