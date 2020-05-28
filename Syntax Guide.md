# Syntax Guide 

## Reserved Tags

### If Statements

```html
<If>
    <condition><isGreaterThan><x/><y/></isGreaterThan></condition>
    <x declare="true"><plus></x><arg>1</arg></plus></x>
</If>
```

```html
<If>
    <condition><isGreaterThan><x/><y/></isGreaterThan></condition>
    <x declare="true"><plus><x/><arg>1</arg></plus></x>
    <Else> <!-- HiAPL does not have else if statements. To replicate this redundant behavior simply nest an <If> block in an <Else> block -->
        <x declare="true"><minus><x/><arg>1</arg></minus></x>
    </Else>
</If>
```

### Loops

```html
<While>
    <condition><isGreaterThan><x/><y/></isGreaterThan></condition>
    <x declare="true"><plus><x/><arg>1</arg></plus></x>
</While>
```
For loops? Boring! Here's some syntactical salt for that wound:

```html
<!-- for -->
<i init="true"><arg>0</arg></i> <!-- i = 0 -->
<While>
    <condition><isLessThan><i/><arg>100</arg></isLessThan></condition> <!-- i < 100 -->
    <!-- some code -->
     <i declare="true"><plus><i/><arg>1</arg></plus></i> <!-- i++ -->
</While>
<Delete><i/></Delete> <!-- Bringing manual back garbage collection to JavaScript since 2020 -->
```

### Special Tags

Have you ever been writing a while loop and happen to forget to put your condition in forcing you to waste countless CPU cycles scrolling back up in order to put in? We've eliminated this problem. All special tags (e.g. `params`, `condition`, etc.) can be placed anywhere in the block. Feel free to place your `<If>` `<condition>`'s at the beginning, end, or even the middle of your code. 


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
```