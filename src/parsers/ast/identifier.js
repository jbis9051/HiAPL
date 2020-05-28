// Dependencies:
const { Expression } = require('./expression');

class Identifier extends Expression {
    constructor (name, loc) {
        super();
        this.name = name;
        this.loc = loc;
    }
}
module.exports = {Identifier};
