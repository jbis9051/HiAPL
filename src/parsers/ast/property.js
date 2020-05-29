// Dependencies:
const { Node } = require('./node');

class Property extends Node {
    constructor(key, value, loc) {
        super();
        this.key = key;
        this.value = value;
        this.kind = "init";
        this.method = false;
        this.shorthand = false;
        this.loc = loc;
    }
}
module.exports = {Property};
