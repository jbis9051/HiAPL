// Dependencies:
const { Expression } = require('./expression');

class ObjectExpression extends Expression {
    constructor (properties, loc) {
        super();
        this.properties = properties;
        this.loc = loc;
    }
}
module.exports = {ObjectExpression};
