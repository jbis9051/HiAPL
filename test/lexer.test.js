const mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const lexer = require('../src/lexer');

describe('lexer test', () => {
    it('should lex', (done) => {
        const input = fs.readFileSync(path.join(__dirname, '../examples/example.hiapl'));
        const lexResult = lexer(input.toString());
        console.log(lexResult);
        done();
    });

})
