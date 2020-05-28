const lexer = require('./lexer');
const htmlParser = require('./parsers/HTMLParser').HTMLParser;
const hiAPLParser = require('./parsers/HiAPLParser/HiAPLParser');
const escodegen = require('escodegen');

module.exports = function hiaplc(string) {
    const x = hiAPLParser(htmlParser(lexer(string)));
    return escodegen.generate(x);
}