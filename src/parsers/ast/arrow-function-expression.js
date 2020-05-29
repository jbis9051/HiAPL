// Dependencies:
const { Expression } = require('./expression');

class ArrowFunctionExpression extends Expression {
    constructor (params, body, loc) {
        super();
        this.id = null;
        this.params = params;
        this.body = body;
        this.loc = loc;
    }
}
module.exports = {ArrowFunctionExpression};
