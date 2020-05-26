class Element {
    constructor(parent) {
        this.name = undefined;
        this.type = this.constructor.name;
        this.children = [];
        this.parent = parent;
        this.attributes = {};
        this.rawContent = null;
    }
}
module.exports = Element;
