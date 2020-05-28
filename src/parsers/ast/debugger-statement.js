// Dependencies:
const { Statement } = require('./statement');

class DebuggerStatement extends Statement {
    constructor (loc) {
        super();
        this.loc = loc;
    }
}
module.exports = {DebuggerStatement};
