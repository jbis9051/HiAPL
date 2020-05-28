// Dependencies:
const { Statement } = require('./statement');

class WhileStatement extends Statement {
    constructor (test, body, loc) {
        super();
        this.test = test;
        this.body = body;
        this.loc = loc;
    }
}
module.exports = {WhileStatement};
