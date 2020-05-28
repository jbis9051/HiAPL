// Dependencies:
const { Node } = require('./node');

class VariableDeclarator extends Node {
    constructor (identifier, initialValue, loc) {
        super();
        this.id = identifier;
        this.init = initialValue;
        this.loc = loc;
    }
}
module.exports = {VariableDeclarator};
