// Dependencies:
const { Expression } = require('./expression');

class ArrayExpression extends Expression {
    constructor(elements, loc) {
        super();
        this.elements = elements;
        this.loc = loc;
    }
}
module.exports = {ArrayExpression};
