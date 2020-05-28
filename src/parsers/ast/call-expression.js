// Dependencies:
const { Expression } = require('./expression');

class CallExpression extends Expression {
    constructor (callee, args, loc) {
        super();
        this.callee = callee;
        this.arguments = args;
        this.loc = loc;
    }
}
module.exports = {CallExpression};
