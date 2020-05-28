// Dependencies:
const { Declaration } = require('./declaration');

class VariableDeclaration extends Declaration {
    constructor (declarations, loc) {
        super();
        this.declarations = declarations;
        this.kind = 'var';
        this.loc = loc;
    }
}
module.exports = {VariableDeclaration};
