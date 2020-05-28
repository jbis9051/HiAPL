const {Comment, Node} = require('../HTMLParser');
const AST = require('../ast');

const reservedTags = {
    If: (IfElement) => {
        getCondition(IfElement);
    },
    While: (WhileElement) => {

    },
    Delete: (DeleteElement) => {

    },
    Return: (ReturnElement) => {

    },
}

function getCondition(element) {
    const conditions = element.children.filter(child => child.name === "condition");
    if (conditions.length === 0) {
        throw 'Expected Condition';
    }
    if (conditions.length > 1) {
        throw 'Expected One Condition';
    }
    const condition = conditions[0];
    if (condition.children === 0) {
        throw 'Expected the condition to have children';
    }
    if (condition.children.length > 1) {
        throw 'Expected the condition to have one child';
    }
    return parseNode(element);
}

function parseHiAPL(HTMLRoot) {
    return new AST.Program(HTMLRoot.children.map(child => parseBlock(child)));
}

function ensureAChild(element) {
    if (element.children.length !== 1) {
        throw `Expected a child for element ${element.name}`
    }
}

/**
 *
 * @param {Node} node
 */
function parseBlock(node) {
    if (Object.keys(reservedTags).includes(node.name)) {
        return reservedTags[node.name](node);
    }
    if (node.attributes.init && node.attributes.init.content === "true") {
        ensureAChild(node);
        return new AST.VariableDeclaration([new AST.VariableDeclarator(new AST.Identifier(node.name), parseExpectingResult(node.children[0]))]);
    }
    return new AST.ExpressionStatement(parseExpectingResult(node));
}

function parseExpectingResult(element, options) {
    if (Object.keys(reservedTags).includes(element.name)) {
        throw `Unexpected ${node.name}`;
    }
    if (element.attributes.declare && element.attributes.declare.content === "true") {
        ensureAChild(element);
        return new AST.AssignmentExpression(new AST.Identifier(element.name), parseExpectingResult(element.children[0]))
    }
    if (element.attributes.init && element.attributes.init.content === "true") {
        throw 'Syntax Error: You cannot initialize a variable here.';
    }
    if (element.closure === "short") {
        return new AST.Identifier(element.name);
    }
    if (element.name === "arg") {
        let value = element.content;
        if (value.match(/^[0-9]+$/) && !(element.attributes.string && element.attributes.string.content === "true")) {
            value = parseInt(value);
        }
        return new AST.Literal(value);
    }

    return new AST.CallExpression(new AST.Identifier(element.name), element.children.map(child => parseExpectingResult(child)));
}

module.exports = parseHiAPL;
