# Syntax Guide 

Welcome! Let's get Started:

## Intro

HiAPL stands for HTML is a programming language. HiAPL was inspired by Google listing [HTML as a programming language](https://i.redd.it/wmoaf3m765d21.jpg).

HiAPL compiles to vanilla JavaScript but is written using HTML tags and attributes.

## Reserved Tags

Similar to JavaScript keywords, HiAPL has a set of reserved tags. Keywords always start with a capital letter.

### If Statements

```html
<If>
    <condition><isGreaterThan><x/><y/></isGreaterThan></condition>
    <x assign="true"><plus></x><arg>1</arg></plus></x>
</If>
```

```html
<If>
    <condition><isGreaterThan><x/><y/></isGreaterThan></condition>
    <x assign="true"><plus><x/><arg>1</arg></plus></x>
    <Else> <!-- HiAPL does not have else if statements. To replicate this redundant behavior simply nest an <If> block in an <Else> block -->
        <x assign="true"><minus><x/><arg>1</arg></minus></x>
    </Else>
</If>
```

### Loops

```html
<While>
    <condition><isGreaterThan><x/><y/></isGreaterThan></condition>
    <x assign="true"><plus><x/><arg>1</arg></plus></x>
</While>
```
For loops? Boring! Here's some syntactical salt for that wound:

```html
<!-- for -->
<i init="true"><arg>0</arg></i> <!-- i = 0 -->
<While>
    <condition><isLessThan><i/><arg>100</arg></isLessThan></condition> <!-- i < 100 -->
    <!-- some code -->
     <i assign="true"><plus><i/><arg>1</arg></plus></i> <!-- i++ -->
</While>
<Delete><i/></Delete> <!-- Bringing manual back garbage collection to JavaScript since 2020 -->
```

### Special Tags

In addition to keywords, HiAPL has special tags. These tags can only be used where approirate and cannot be overidden.

- `<condition>` allowed once in a `<While>` or `<If>` tag
- `<arg>` see `<arg>` section
- `<params>` allowed once in a function decleration. See Function decelerations for more info.

Have you ever been writing a while loop and happen to forget to put your condition in forcing you to waste countless CPU cycles scrolling back up in order to put in? We've eliminated this problem. All special tags can be placed anywhere in the block. Feel free to place your `<If>` `<condition>`'s at the beginning, end, or even the middle of your code. 

## Variables

Variables can be initalized and assigned by using the `init="true"`, `assign="true"` attributes respectivly.

Variables must be initialized with a value. Literals must be wrapped in an `<arg>`. 

```html
<x init="true"><arg>Hello World</arg></x>
```

### Objects

Use attrbitues and shorthand to declare objects. `init` and `declare` attributes are implcitily ignored.

```html
<x init="true" test="test1" foo="bar" /> <!-- var x = { test: "test1", foo: "bar" } -- >
```

To refer to numbers, booleans, or varaibles, don't use quotes.

```html
<x init="true" test="test1" foo="bar" /> <!-- var x = { test: "test1", foo: "bar" } -->
<y init="true" bar=x.foo  test3=true april=20 /> <!-- var y = { bar: x.foo, test3: true, april: 20 } -->
```

## `<arg>`

Literals must be wrapped in an `<arg>`.

To specify a type use the `type` attribute. Acceptable values are:

- `string`
- `number`
- `boolean`
- `array`

```
<arg>2020</arg> <!-- 2020 -->
<arg type="string">2020</arg> <!-- "2020" -->
```

```
<arg type="string">Hello World</arg> <!-- "Hello World" -->
```

## Comments

HTML comments are supported. `<!-- Comments -->`.

## Escaping

*Note*: This feature is planned.

```text
< becomes &lt;
> becomes &gt;
```

## Injecting Raw JavaScript

HiAPL should have most of the functioanlity you need but if you must inject JavaScript you can use the eval function.

```html
<eval>
   <arg>console.log('Hi')</arg>
</eval>
```

## Function Declerations

### `<params>`

`<params>` tags can only be placed inside functions and are used to declare them. They can only contain `<param>` children. `<param>`s cannot contain children. `<param>`s innerText will be the parameter name used in the function. Paramter destructering is not supported.

### Declarating Functions/Function Expresssions

To declare a function add a `<params>` as a child of an element. The element's name will be the functions name. 

For example:

```html
<funcName>
    <params><param>aParam</param></params>
    <console>
        <log>
            <aParam/>
        </log>
    </console>
</funcName>
```

transpiles to

```js
function funcName(aParam) {
  console.log(aParam);
}
```

To a declare a function that doesn't accept parameters simply leave `<params>` empty or use HTML shorthand `<params/>`.

## Calling Functions

To call a function create a tag with the function name as the tag name and add an attribute `call="true"`. All children will be passed as args.

```html
<funcName call="true">
    <arg>Hello World</arg>
</funcName>
```

## Accessing Members

In JavaScript you may do something like `console.log('Hello World')`. To access the `log` property of `console` in HiAPL simply add it as a child.

```html
<console>
    <log call="true">
        <arg>Hello World</arg>
    </log>
</console>
```

#### Anonymous functions

Anonymous functions can be declared using the `<func>` tag.

To create an arrow function simply add a `arrow="true"` attribute on your `<func>`.

## Implicit Stuff

Most implicit things can be overridden by specifiying things explicitly. 

### `<arg>`

- If `<arg>` has any children it implcitly has type array
- If `<arg>` innerText has just a number, it will be implicitly parsed as a number

```
<arg>2020</arg> <!-- 2020 -->
<arg type="string">2020</arg> <!-- "2020" -->
```

### Function calls

An Element will be an implicit call (`call="true"`) if any of the following are true:

- It has more than one child.
- It has zero children AND it doesn't use the HTML close shorthand (`<funcName/>`).
- It has one child AND ( that child uses the HTML close shorthand (`<funcName/>`) OR that child is an `<arg>` element )


```html
<console>
    <log call="true">
        <arg>Hello World</arg>
    </log>
</console>
```

and 

```html
<console>
    <log>
        <arg>Hello World</arg>
    </log>
</console>
```

compile to 

```js
console.log("Hello World");
```

but

```html
<console call="true">
    <log>
        <arg>Hello World</arg>
    </log>
</console>
```

compiles to

```js
console(log("Hello World"));
```

## Built in functions:

These are described below in JavaScript for easy reading.

```js
// math
function plus(arg1, arg2) {
    return arg1 + arg2;
}

function minus(arg1, arg2) {
    return arg1 - arg2;
}

function multiply(arg1, arg2) {
    return arg1 * arg2;
}

function divide(arg1, arg2) {
    return arg1 / arg2;
}

// comparison logic
function isGreaterThan(arg1, arg2) {
    return arg1 > arg2;
}

function isLessThan(arg1, arg2) {
    return arg1 < arg2;
}

function isLessThanOrEqualTo(arg1, arg2) {
    return arg1 <= arg2;
}

function isGreaterThanOrEqualTo(arg1, arg2) {
    return arg1 >= arg2;
}

// logic

function or(arg1, arg2) {
  return arg1 || arg2;
}

function and(arg1, arg2) {
  return arg1 && arg2;
}

function xor(arg1, arg2) {
  return arg1 ^ arg2;
}

function equal(arg1, arg2) {
  return arg1 === arg2;
}

function mod(arg1, arg2) {
  return arg1 % arg2;
}
```
