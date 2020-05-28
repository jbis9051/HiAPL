// Dependencies:
const { Statement } = require('./statement');

class ExpressionStatement extends Statement {
    constructor (expression, loc) {
        super();
        this.expression = expression;
        this.loc = loc;
    }
}
module.exports = {ExpressionStatement};
