# HiAPL
*HTML is a programming language*

Inspired by Google listing HTML as a programming language, HTML is becoming a programming language.

# Get Started

Lets starting writing! HiAPL follows basic HTML syntax with tags, attributes, and more!

```html
<console>
    <log>
        <arg>Hello World</arg>
    </log>
</console>
```

# Install

```shell script
$ git clone https://github.com/jbis9051/HiAPL.git
$ cd HiAPL
$ npm install
```

optionally add to your path
- Temporary: Write `export PATH=$PATH:/path/to/HiAPL/bin` to terminal.
- Permanent: Append `export PATH=$PATH:/path/to/HiAPL/bin` to the end of your ~/.bashrc file.


# Usage

1. Write a HiAPL file
2. Execute `hiaplc /path/to/your/file.hiapl`
3. A file will be outputted to an `./out` folder in the current working directory
4. Run the file with `node`, or use include in on your webpage

# Documentation

The Syntax Guide can be found [here](https://github.com/jbis9051/HiAPL/blob/Syntax%20Guide.md).

# Contributing

If you have found a feature, please report it [here](https://github.com/jbis9051/HiAPL/issues).

# FAQ

## Who?

JBis - the creator

You - the user

## What?

HiAPL (stands for HTML is a programming language) is a new up and coming language that compiles to JavaScript.

## Why?

Why not?

## Where?

Client side and server side. For node, simply look at the import syntax:

**Note:** ES6 import syntax is a planned feature and not available yet. You can use require now.

```html
<head>
    <meta type="import" module="fs">
</head>
<!-- Now You can use the module -->
<text init="true">
  <fs>
    <readFileSync><arg>./text.txt</arg></readFileSync>
  </fs>
</text>
```

## When?

Now, of course. Learn it now.

## How are we making the world a better place?

We are currently in the midst of a pandemic. No, not COVID-19. A global programming language shortage. [Especially](https://www.typescriptlang.org/) [ones](https://coffeescript.org/) [that](https://www.purescript.org/) [compile](https://clojurescript.org/)  [to](https://www.scala-js.org/) [JavaScript](http://vanilla-js.com/). HiAPL aims to solve that problem by creating a single language that can be used for all purposes. Client side web, server side, and native applications.

## You keep saying "HTML". Don't you mean XML?

Oh so you're *that* guy.
