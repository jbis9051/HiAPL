// Dependencies:
const { Statement } = require('./statement');

class ForStatement extends Statement {
    constructor (init, test, update, body, loc) {
        super();
        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
        this.loc = loc;
    }
}
module.exports = {ForStatement};
