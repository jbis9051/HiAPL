// Dependencies:
const { Statement } = require('./statement');

class IfStatement extends Statement {
    constructor(test, consequent, alternate, loc) {
        super();
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
        this.loc = loc;
    }
}
module.exports = {IfStatement};
