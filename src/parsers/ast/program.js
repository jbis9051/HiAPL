// Dependencies:
const { Node } = require('./node');

class Program extends Node {
    constructor (body) {
        super();
        this.body = body;
    }
}
module.exports = {Program};
