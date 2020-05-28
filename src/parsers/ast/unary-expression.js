// Dependencies:
const { Expression } = require('./expression');

class UnaryExpression extends Expression {
    constructor (operator, argument, prefix, loc) {
        super();
        this.operator = operator;
        this.argument = argument;
        this.prefix = prefix;
        this.loc = loc;
    }
}
module.exports = {UnaryExpression};
