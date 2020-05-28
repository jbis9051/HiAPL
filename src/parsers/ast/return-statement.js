// Dependencies:
const { Statement } = require('./statement');

class ReturnStatement extends Statement {
    constructor (argument, loc) {
        super();
        this.argument = argument;
        this.loc = loc;
    }
}
module.exports = {ReturnStatement};
