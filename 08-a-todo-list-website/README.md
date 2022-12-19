# 08: A TODO List Website

You have your TODO database, a module to use it, and a test to make sure the module keeps working.  You also know how to create a web application that can accept requests and return HTML responses.

You are now going to combine these things to create a simple TODO list web application.  Your web application should do the following:

1. Use forms, checkboxes, and buttons (at a minimum) in the UI for the TODO list.
2. Store the changes the user makes in the database you've made.
3. Use command line options in the Express.js application to let people change the startup options for port, host, and database.
4. Use a template that lets you change the design without changing the main UI templates. This is a "layout template".
5. _Advanced_ Support searching for TODOs.
6. _Advanced_ Support pagination, which means if I have 1000 TODOs then you only show 25 and I can "page through" the results.
7. _Super Advanced_ Use [ava](https://github.com/avajs/ava) and [Playwright](https://playwright.dev/) to write a UI test for your application.

For pagination, look at the [knex-paginate](https://github.com/felixmosh/knex-paginate) project for help doing it.

## Learning Objective

You're objective here is to combine all the things you've learned so far into one simple web application.  The simplicity of the TODO list application allows you to flex your learning on the subjects of database access, testing, and web applications.  Take your time with this and focus on one thing at a time.  I recommend getting the UI to work first with fake data, then connect it to the database.

If you're going to try testing with `Playwright` then you can changet his tactic and create the UI, then write a test for the UI, then connect it to the database while you keep running the test.

## Advanced Options

In this exercise you have 2 _Advanced_ and 1 _Super Advanced_ option.  These are useful things to know, but they aren't essential for the learning objective.  If you get to these 3 features and you're burned out try taking a break, then redo the whole project again.  Repeating these exercises is a great way to prove to yourself you can do it, rather than believing it was "just luck."
