const obj = global || window;

obj.plus = function plus(arg1, arg2) {
    return arg1 + arg2;
}

obj.minus = function minus(arg1, arg2) {
    return arg1 - arg2;
}

obj.multiply = function multiply(arg1, arg2) {
    return arg1 * arg2;
}

obj.divide = function divide(arg1, arg2) {
    return arg1 / arg2;
}

// comparison logic
obj.isGreaterThan = function isGreaterThan(arg1, arg2) {
    return arg1 > arg2;
}

obj.isLessThan = function isLessThan(arg1, arg2) {
    return arg1 < arg2;
}

obj.isLessThanOrEqualTo = function isLessThanOrEqualTo(arg1, arg2) {
    return arg1 <= arg2;
}

obj.isGreaterThanOrEqualTo = function isGreaterThanOrEqualTo(arg1, arg2) {
    return arg1 >= arg2;
}

// logic

obj.or = function or(arg1, arg2) {
    return arg1 || arg2;
}

obj.and = function and(arg1, arg2) {
    return arg1 && arg2;
}

obj.xor = function xor(arg1, arg2) {
    return arg1 ^ arg2;
}

obj.equal = function equal(arg1, arg2) {
    return arg1 === arg2;
}

obj.mod = function mod(arg1, arg2) {
    return arg1 % arg2;
}
