const Node = require('./Node');

class Comment extends Node {
    constructor(parent) {
        super(parent);
        this.content = null;
    }
}
module.exports = Comment;
