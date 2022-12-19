## Replicate `find`

This exercise is very similar to the `ls` exercise, but instead of simply listing based on a pattern you are taking various commands to more finely control the search.  This will help you solidify your understanding of the `fs` module which will be _essential_ for future exercises.

## Notes on Commander.js

The `find` command is an odd one because it uses the non-standard `-name` style (one dash, one word) while the rest of Unix tools use `--name` style (two dash, one word) or `-n` (one dash, one letter) style.  For now, if you want to keep using [commander.js](https://github.com/tj/commander.js/) then you'll have to use the `--name` style and just go with it for now.

## `find` For Windows

Windows doesn't have `find` so you'll have to research how it works either inside `Windows Subsystem for Linux` or from the [man page](https://man7.org/linux/man-pages/man1/find.1.html).

Another option is to replicate the PowerShell [Get-ChildItem](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem?view=powershell-7.2) or `gci` for short.  If you're not interested in running WSL for this exercise then I recommend this path, but my tutorial will replicate `find`.

## Learning Objectives

This exercise is all about cementing your understanding of everything learned so far:

1. Patterns using Regular Expressions (RegExp).
2. Recursively processing and finding files.
3. Using `fs.stat` to read the attributes of a file.
4. Getting command line options from the user.

Once you're done with this exercise you should be well versed in files, directories, file attributes, and how to find them for processing.
