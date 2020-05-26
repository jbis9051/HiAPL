const mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const lexer = require('../src/lexer');

describe('lexer test', () => {
    it('should lex', (done) => {
        const input = fs.readFileSync(path.join(__dirname, '../examples/example3.hiapl'));
        const consumer = console.log;
        lexer(input.toString(), consumer);
        done();
    });

})
