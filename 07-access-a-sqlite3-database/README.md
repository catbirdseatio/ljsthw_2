# 07: Access a SQLite3 Database

You'll now learn the basics of a project named [knex.js](http://knexjs.org/) to access a [SQLite3](https://www.sqlite.org/index.html).  You'll need to create a database for the next exercise that stores TODO lists, so you might want to check out the next exercise to get an idea of where this database is going.

## Step 1: Migrations

To do this you'll first need to learn how to create a migration that creates your database.  The documentation for migrations is in the [knex.js migrations](http://knexjs.org/guide/migrations.html) documentation. You're specifically looking at how to use `createTable` and `dropTable` in a migration.

Your TODO list table should have the following fields:

1. id - the primary id for the row.  Use `table.increments('id')` to do this.
2. updated_at and created_at -- you can use `table.timestamps(true, true)` to automatically generate these.
3. completed -- This is a boolean value, but you'll find that booleans are weird in SQLite3 and are treated as integers.
4. description -- The actual text for the TODO item.

Once you have these think about other things you want in a TODO list and add them too.  You don't need to keep making migrations for every change, just rollback this one, update it, and add more.

## Step 2: Test and Models

Next you want install the [ava](https://github.com/avajs/ava) so you can have a nice automated test runner.  You'll want to study the [ava documentation](https://github.com/avajs/ava/blob/main/docs/01-writing-tests.md) and create a simple empty test to get going.

Once `ava` is installed you'll use it to test a module that uses `knex` to access the database.  Your module should do the basic operations normally called "CREATE, READ, UPDATE, DELETE" to get started, and then write a test for each one.

## Step 3: Test First or Test After

You have two ways you can approach the testing process:

1. Write your test based on what a function in your Model module should do, then write the code to make the test work.  This is called "test first."
2. Write a function in your Model module, then write a test to make sure it's working and try to push it further.  This is called "test after."

Generally I use "test first" if I've implemented this a million times before and already know how it should work.  This is rare so I more often use "test after", but I work in such a tight loop that honestly it doesn't matter.  In fact, anyone telling you that you have to religiously do one or other is probably the type of person who never works on anything new and only does the same thing over and over.  Real people use whatever strategy works best depending on the situation.

## Learning Objectives

You're mostly learning how `knex.js` and `ava` work, with a little bit about testing process and database design. You'll definitely want to look at the next exercise, and reference my solution as much as possible when you get lost.
