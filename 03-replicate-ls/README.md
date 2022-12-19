## Replicate `ls`

This starts you off with a simple command line parsing library and a globbing library to get going named [fast-glob](https://www.npmjs.com/package/fast-glob).  "Globbing" is what you're doing when you use regular expression patterns to match files like this:

```bash
ls *.txt
```

The `fast-glob` library is a good library with only one quirk to watch out for:  It will not convert `\` (backslash) characters to `/` in your glob.  That means if you use `C:\Users\zed\*.txt` it will fail.  You'll have to convert all `\` to `/` on Windows.

## File Attributes

Part of the `ls` command is printing out the attributes of a file. For that you'll need `fs.stat` found in the [fs](https://nodejs.org/docs/latest-v16.x/api/fs.html) module.

## Removing `fast-glob`

If you can get your `ls` copy working with `fast-glob` then try removing `fast-glob` and replicate its functionality with your own code.  You'll need the [fs](https://nodejs.org/docs/latest-v16.x/api/fs.html) module and specifically the `readdir` function.

## Learning Objectives

As with all of the exercises thus far you aren't just learning how to replicated `ls` but you'll also:

1. Learn more about the `fs` module.
2. Learn how to process command line options. Try [commander](https://github.com/tj/commander.js/).
3. Learn how to list files recursively based on a pattern using `fast-glob` and how `fast-glob` works by replacing it.
4. Learn about file attributes with the `fs.stat` function.
