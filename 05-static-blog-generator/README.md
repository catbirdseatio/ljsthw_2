= Ex 05: Static Blog Generator

This exercise has you use a templating system, and what you've learned from Ex 04 to process a directory of .md files and convert them to .html files.  This is a simple static blog generator, but as with all of the previous exercises you're goal is to push it as far as you can trying as many techniques as you can.

## Solve Markdown, then Design

Since you've gone through the HTML and CSS portions of the course you should be able to create a decent starter CSS, but I highly suggest you just create a quick one using [blockstart.css](https://learnjsthehardway.com/blockstart/) or even grab a premade "classless CSS" to get started.  You can also use the one from the course at [zedshaw.games](https://zedshaw.games/global.css) which will get you started as well, and is also a classless CSS.

I recommend getting your markdown processing right, _then_ take the time to design your blog with CSS.  However, if you're stuck then try doing the design first using fake text and use that to process your markdown files.

## Getting Fake Text

You can use services that produce "lorem ipsum" to generate a bunch of fake .md files.  I really like the [hipsum.co](https://hipsum.co/) generator for this.  Because it's funny.

## Markdown Processors

Markdown is a way to write content with formatting similar to old school text emails, but have it render with HTML.  You'll write something like this:

```markdown
I _said_ don't move!
```

And the markdown parser will convert it to this:

```html
I <em>said</em> don't move!
```

I recommend the [remarkable](https://github.com/jonschlinkert/remarkable) parser as it works well and you can modify its output.

## Using What You Know

You know quite a lot that will help you solve this:

1. Matching files based on extensions recursively.
2. Handling command line options.
3. Opening files for parsing.

All you're doing now is combining this with your knowledge of HTML and CSS.
