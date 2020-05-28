// Dependencies:
const { Expression } = require('./expression');

class LogicalExpression extends Expression {
    constructor (operator, left, right, loc) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.loc = loc;
    }
}
module.exports = {LogicalExpression};
