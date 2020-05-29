const lexer = require('./lexer');
const htmlParser = require('./parsers/HTMLParser').HTMLParser;
const hiAPLParser = require('./parsers/HiAPLParser');
const escodegen = require('escodegen');
const fs  = require('fs');


module.exports = function compileHiAPL(string, withBuiltInFunctions = true) {
    const userCode = hiAPLParser(htmlParser(lexer(string)));
    const transpiled = escodegen.generate(userCode);
    if(!withBuiltInFunctions){
        return transpiled;
    }
    const buildInFunctions  = fs.readFileSync(__dirname + '/builtInFunctions.js').toString();
    return buildInFunctions + "\n" + transpiled;
}
