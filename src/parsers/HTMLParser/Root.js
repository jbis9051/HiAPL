const Element = require('./Element');

class Root extends Element {
    constructor() {
        super( null);
        this.name = "root";
    }
}

module.exports = Root;
