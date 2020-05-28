// Dependencies:
const { Expression } = require('./expression');

class FunctionExpression extends Expression {
    constructor (params, body, loc) {
        super();
        this.params = params;
        this.body = body;
        this.loc = loc;
    }
}
module.exports = {FunctionExpression};
