const mocha = require('mocha');
const fs = require('fs');
const path = require('path');


const hiAPLc = require('../src');

describe('hiaplc test', () => {
    it('should compile', (done) => {
        const input = fs.readFileSync(path.join(__dirname, '../examples/fizzbuzz.hiapl')).toString();
        const js = hiAPLc(input);
        console.log(js);
        console.log("-----")
        eval(globals + js);
        done();
    });

})


const globals = `
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
`;
