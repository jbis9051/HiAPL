// Dependencies:
const { Expression } = require('./expression');

class MemberExpression extends Expression {
    constructor (object, property, computed, loc) {
        super();
        this.object = object;
        this.property = property;
        this.computed = computed;
        this.loc = loc;
    }
}
module.exports = {MemberExpression};
