const mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const lexer = require('../src/lexer');
const htmlParser = require('../src/parsers/HTMLParser/HTMLParser');

describe('HTMLParser test', () => {
    it('should parser', (done) => {
        const input = fs.readFileSync(path.join(__dirname, '../examples/example.hiapl'));
        const lexResult = lexer(input.toString());
        const hiAplTree = htmlParser(lexResult);
        console.log(hiAplTree)
        done();
    });

})
