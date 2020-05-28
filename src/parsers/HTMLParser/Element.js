const Node = require('./Node');

class Element extends Node {
    constructor(parent) {
        super(parent);
        this.name = undefined;
        this.children = [];
        this.comments = [];
        this.attributes = {};
        this.content = "";
        this.closure = "long"
    }
}
module.exports = Element;
