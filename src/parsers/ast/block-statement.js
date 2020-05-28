// Dependencies:
const { Statement } = require('./statement');

class BlockStatement extends Statement {
    constructor (body, loc) {
        super();
        this.body = body;
        this.loc = loc;
    }
}

module.exports = {BlockStatement};
