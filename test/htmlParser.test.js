const mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const lexer = require('../src/lexer');
const htmlParser = require('../src/parsers/HTMLParser/HTMLParser');

describe('HTMLParser test', () => {
    it('should parser', (done) => {
        const input = fs.readFileSync(path.join(__dirname, '../examples/example3.hiapl'));
        const arr = [];
        const consumer = Array.prototype.push.bind(arr);
        lexer(input.toString(), consumer);
        const hiAplTree = htmlParser(arr);
        done();
    });

})
