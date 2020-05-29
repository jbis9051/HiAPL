// Dependencies:
const { Declaration } = require('./declaration');

class FunctionDeclaration extends Declaration {
    constructor (id, params, body, loc) {
        super();
        this.id = id;
        this.params = params;
        this.body = body;
        this.loc = loc;
    }
}
module.exports = {FunctionDeclaration};
