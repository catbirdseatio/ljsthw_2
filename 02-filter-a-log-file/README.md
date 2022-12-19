# 02: Filter a Log File

In this exercise you'll take a webserver log I've created and parse the log file then filter the log for special events or information.  You have a couple of approaches:

1. Brute force the filter by simply using a regex to scan the raw text.
2. Parse each line into meaningful data and filter on that.

The two samples in this directory get you started with both approaches.  The `step1.js` file starts off the brute force `RegEx` method while the `step2.js` starts off the parsing method.

Keep in mind these are not solutions.  They're starter file so you can get going without having to struggle with all of the setup.  Once you're done you should attempt this again but do it entirely from nothing so you know how that's done.

## Learning Objectives

As with all of these exercises you're not really learning about the parsing log files.  Your actual goal is:

1. Learn how a [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) works.
2. Learn how to do more than just simple regular expression matching lines.  This would be a next level challenge.

A small side adventure is how to load and process text files, but you should have learned that from Ex 01.
