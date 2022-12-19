# 09: A Fully Dynamic Blog

Your blog would be much better if people could post comments, so you'll use a [SQLite3](https://www.sqlite.org/index.html) database to store their comments on each post.  You'll also display their comments, and optionally require a login to post.

## Model-View-Controller

The "classic" web application style you're creating is called a "Model-View-Controller" (MVC) architecture. The design is separated into:

1. Models store and manipulate the database, usually stored in a database.
2. Views present the information to the user and accept their input to alter the models.
3. Controller is responsible for translating and connecting the Views to the Models and controlling access.

This architecture style is kind of dated, but it is useful when you have a data storage system that is difficult to change, but you still need to present that information to users in different ways.  Rather than spend months changing a database's stored procedures you'd simply write a Controller that took existing data and transformed it to match the view.

In your application you'll create a simplified MVC system like this:

1. Model is a simple module that performs the queries against your database using [knex.js](http://knexjs.org/) to return plain old JavaScript objects (POJOs).
2. Views that are templates that which accept this data after being converted by controllers.
3. Controllers are simple handlers in your `Express.js` application, but if those get too large you should put them into separate modules that you import.

## The ORM Warning

Normally in an OOP language like Java, Python, or C++ you'd want to translate the tables you get from SQLite3 and translate them to objects.  This is what an Object-Relational Mapper (ORM) does.  The reason these languages need this translation is their objects are distinct data types that are separate from their Arrays or Map structures.  In JavaScript the objects are also the Maps so the need for an ORM is much lower.  What you get from a `knex.js` query is...an object. It's 80% ready to go, and for most of your work you won't need to add any other OOP to them.

I'm mentioning this because you might run into projects that basically take `knex.js` and then overcomplicate it to give you an ORM.  These ORMs end up being more work than they're worth so I would avoid them. If you desperately want to have classes and objects come out of your SQL then wait until later in the course and you'll get to use a very minimalist ORM I created that does 95% of what you need and is far easier to understand and use.

## Learning Objectives

You are learning how to store data in the database from your web application, but you're really learning how to use `knex.js` and how an MVC application architecture works.  I recommend you reference the application in this directory heavily as you work on your own since this architecture is difficult to create "intuitively".
