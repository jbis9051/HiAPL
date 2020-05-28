const mocha = require('mocha');
const fs = require('fs');
const path = require('path');


const hiAPLc = require('../src');

describe('hiaplc test', () => {
    it('should compile', (done) => {
        const input = fs.readFileSync(path.join(__dirname, '../examples/example.hiapl')).toString();
        const js = hiAPLc(input);
        console.log(js);
        console.log("-----")
        eval(js);
        done();
    });

})
