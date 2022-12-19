# 10: A Simple JSON API

In this exercise you'll make a new version of your TODO application, but using slightly "older" techniques to create an interactive UI that uses a JSON API.

## Windows Users

You'll need to download curl for windows from [curl.se](https://curl.se/windows/) if you're on
windows.  The only problem is PowerShell comes with a fairly lame `curl` that's an alias for
`Invoke-WebRequest`. You can just type `curl.exe` and that'll use the real curl.  You can also or run this command:

```powershell
remove-item alias:curl
```

After that you should be able to run `curl` like normal with just:

```powershell
curl
curl: try 'curl --help' or 'curl --manual' for more information
```

The only problem is you'll have to do this every time you start PowerShell.  Making this permanent
is...complicated. Just type `curl.exe` instead.

## Starter JSON API Code

The file `api.js` implements a minimalist JSON API and a bit of web server action.  It's intended to get you started with some basic setup, but if you want to practice further you should try to recreate another `Express.js` app on your own.  The important thing to look at is this:

```javascript
app.get("/messages.json", (req, res) => {
  res.status(200).json({message: "HELLO!"});
});
```

This is just a stub to get you started on the idea of a request returning JSON instead of HTML or a file.

## Learning DOM with `jzed.js`

Many years ago I created a "joke" alternative to something called "jQuery" which turns out to be a great way to learn many of the DOM tricks you'll find in older web applications based on jQuery.

In the file `public/index.html` I load up the `public/jzed.js` mini-module of handy functions, and then I demonstrate using it to query the `/messages.json` endpoint from `api.js`.  I also demonstrate how an error happens, and this also updates the UI dynamically based on the data, rather than having HTML come from the server.

## Bringing in Your TODO Models

You should go back to your TODO list code and bring over--or recreate--your data model.  This would be the `knex.js` code you wrote to deal with TODO items in a `SQLite3` database.  You should also bring over--or recreate--the tests and make sure they work too.

## Pulling it All Together

You should now have the following pieces of this puzzle:

1. A starter `api.js` that can handle `GET` requests to `/messages.json` and return JSON data. You'll change this from `/messages.json` to an API that works with your TODO database.
2. A TODO database module that uses `knex.js` to query the database, which returns POJOs (Plain Old JavaScript Objects).  This is key to solving the puzzle.
3. A starter `.html` page that uses JavaScript to take user input and perform HTTP requests against your API server.  The response from your server is JSON, and then used to update the UI.
4. A simple JavaScript library (`jzed.js`) that you can study to see how many of these DOM manipulations are done.  _WARNING:_ The `jzed.js` is meant as a small bit of JavaScript to study, not something to use in production.  There's far more capable libraries you could use instead, but once you study `jzed.js` you'll know how they work better and whether you actually need them.

## Clues to Solving It

You have to "directions" you can go when developing this.  You can go "data first" where you develop the backend API, then migrate to the UI.  You also go "UI first" where you create a fully working UI that doesn't touch the API server, then bring in the API server while keeping the UI working.

For a "Data First" strategy do this:

1. Use the `curl` (or `curl.exe`) command to test your API's ability to expose the TODO database as JSON.
2. Use `node-fetch` to write an automated test with `ava` of your API once you get it working (or before if you like "test first").
3. Once you have your API working well for all the TODO operations, write a simple module in `public/todo.js` that you use in the `.html` files to work with TODOs.  This helps you simplify the access to the API from within the browser.
4. Once this is working develop the UI and use this `public/todo.js` to get all the data to make the UI work.

For a "UI First" strategy do this:

1. Take the `index.html` and design the entire UI design for the TODOs, including all of the active elements you'll be interacting with, but don't make them actually work.
2. Create the `public/todo.js` and have it make all of the interactive elements work, but fake out all of the data you'd normally get from the backend server.
3. Once the UI is working in a fake prototype, then you replace the fake data with actual calls to the backend API.  Given that you already have a TODO data model this should be fairly simple "call fetch, get the JSON" for each function in `public/todo.js`.

Both strategies have their pros and cons, so consider trying them both to see which one works better.  In this scenario I would say having the database and data model means you would get more benefit from getting the UI developed rather than focusing on the data model.  Once you have the UI the data model is easy to plug in.

It can also be useful to do both:  Work on the UI to figure out what needs to go in your data model, then work on the data model to refine the ideas, and finally connect the two together.
