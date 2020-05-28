// Dependencies:
const { Expression } = require('./expression');

class Literal extends Expression {
    constructor(value, loc) {
        super();
        this.value = value;
        this.loc = loc;
    }
}
module.exports = {Literal};
