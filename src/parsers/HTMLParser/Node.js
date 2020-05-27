class Node {
    constructor(parent) {
        this.type = this.constructor.name;
        this.parent = parent;
    }
}
module.exports = Node;
