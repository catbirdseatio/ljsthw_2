# 06: A First Web Application

In this exercise you'll create a "classic" web application.  What this means is:

1. Browsers make requests for a URL, like `/posts/01-my-first-post/`.
2. Your application receives the request, and generates the HTML.
3. Your application then returns that HTML to the browser which displays it.

This is a deceptively simple process that will combine what you've learned so far with the [Express.js](https://expressjs.com/) project version 4.x.  Express.js is a minimalist web application server with good documentation that should be easy for you to use.  It's the one I use throughout the course.

## Your Application Features

Your application should do the following things:

1. Handle requests for blog posts and dynamically load the .md file to return HTML.
2. Use a template system that's separate from the blog contents.
3. Load configuration data from a file in `secrets/config.json`.
4. The configuration file should let you change important things about the blog like it's title, author, etc. and it will render the entire design with the new settings.

## Learning Objectives

Your actual objective is to learn how to learn an API someone else created.  It's very common to find a project you want to use and have to spend time learning how it works.  This requires a combination of going through the documentation, creating a test project, and figuring out how everything fits together.

For Express.js you should start with the [getting started](https://expressjs.com/en/starter/installing.html) to get an overview of how to use Express. Next you should browse [guide of topics](https://expressjs.com/en/guide/routing.html) which is weirdly organized via the dropdown menu. Your final study for Express.js is to browse the [Advanced Topics](https://expressjs.com/en/advanced/developing-template-engines.html). After that you should work on the project for this exercise while keeping the [API](https://expressjs.com/en/4x/api.html) open.
