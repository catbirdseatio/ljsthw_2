# Exercise 01: CSV is Easy...Right?

This is exercise 01 of `JavaScript Level 2` in [Learn JavaScript the Hard Way](https://learnjsthehardway.com/).  It is meant to be done as a challenge with _incorrect_ starting code that you are expected to fix and improve.  I repeat, this code is _incorrect_ on _purpose_ so you can fix it and attempt to do better.

* `step1.js` -- Use two projects to get CSV samples and try to write a simple parser that can parse all of the samples.
* `step2.js` -- This is a starter in case you are stuck, but it still fails and would fail on many CSV files. CSV is more complex than its name lets on.
* `step3.js` -- Take your parser and use the [deep-equal](https://www.npmjs.com/package/deep-equal) project to compare your results to the [csv-spectrum](https://github.com/maxogden/csv-spectrum) project's tests.
* `step4.js` -- Let's up the game and make this a unit test with [ava](https://github.com/avajs/ava), except it doesn't work because of promises/async/await not working with callbacks and events.
* `step5.js` -- First solution to `step4.js` that uses `Promise` directly to wrap callbacks and events.
* `step6.js` -- Second solution that uses [util.promisify](https://nodejs.org/api/util.html#utilpromisifyoriginal) to convert the `spectrum` callback to a `Promise` automatically.

If you attempt this challenge then point me at your solution at [@lzsthw](https://twitter.com/lzsthw) and I'll take a look.

## Learning Objectives

You aren't really learning about CSVs, but actually learning about how to deal with old APIs that use callbacks when you need Promises.  The `csv-spectrum` library uses an old style of operation that loads your data then calls a function for you to process the data.  These days APIs need Promises, and use async/await to deal with the promises.  Using what you learned from the previous module `JavaScript Level 1` you learned quite a lot about async/await/Promise/callbacks so now you apply that knowledge to deal with `csv-spectrum`.

## If You Get Stuck

Remember the programming process of:

1. Write comments in human language describing what the code should do.
2. Write pseudo-code (p-code) under those comments to bridge from human to code.
3. Slowly convert the p-code to JavaScript and _run your script repeatedly while you do._

If you're stuck chances are you're not following this process.  If you need a clue about how to handle the `csv-spectrum` API then jump to the `step5.js` file to see one way, and `step6.js` to see another.  Try to figure it out for yourself, and if you want a clue, remember that the `resolve` parameter to a Promise can be called inside a callback.
