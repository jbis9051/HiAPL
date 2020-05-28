const {Comment, Node} = require('../HTMLParser');
const AST = require('../ast');

const specialTags = ["condition", "params"];

const reservedTags = {
    If: (IfElement) => {
        const [condition, condResult] = getCondition(IfElement);
        const [alternate, altResult] = getAlternate(IfElement);
        const body = IfElement.children
            .filter(child => child !== condition && child !== alternate)
            .map(child => parseBlock(child));
        return new AST.IfStatement(condResult, new AST.BlockStatement(body), altResult)
    },
    While: (WhileElement) => {
        const [condition, condResult] = getCondition(WhileElement);
        const body = WhileElement.children
            .filter(child => child !== condition)
            .map(child => parseBlock(child));
        return new AST.WhileStatement(condResult, new AST.BlockStatement(body))
    },
    Delete: (DeleteElement) => {
        ensureAChild(DeleteElement);
        return new AST.ExpressionStatement(new AST.UnaryExpression("delete", parseExpectingResult(DeleteElement.children[0]), true));
    },
}

function getAttributeContent(el, attr) {
    return el.attributes[attr] && el.attributes[attr].content;
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
    if (condition.children.length === 0) {
        throw 'Expected the condition to have children';
    }
    if (condition.children.length > 1) {
        throw 'Expected the condition to have one child';
    }
    return [condition, parseExpectingResult(condition.children[0])];
}

function getAlternate(element) {
    const alts = element.children.filter(child => child.name === "Else");
    if (alts.length === 0) {
        return [undefined, undefined];
    }
    if (alts.length > 1) {
        throw 'Expected Max of One <Else>';
    }
    const alt = alts[0];
    return [alt, new AST.BlockStatement(alt.children.map(alt => parseBlock(alt)))];
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
 * @param options
 */
function parseBlock(node, options = {}) {
    if (Object.keys(reservedTags).includes(node.name)) {
        return reservedTags[node.name](node);
    }
    if (getAttributeContent(node, "init") === "true") {
        ensureAChild(node);
        return new AST.VariableDeclaration([new AST.VariableDeclarator(new AST.Identifier(node.name), parseExpectingResult(node.children[0]))]);
    }
    return new AST.ExpressionStatement(parseExpectingResult(node));
}

function parseExpectingResult(element, options = {}) {
    if (Object.keys(reservedTags).includes(element.name)) {
        throw `Unexpected ${element.name}`;
    }
    if (specialTags.includes(element.name)) {
        throw `Special Tag: ${element.name} not allowed here`;
    }
    if (element.name === "Else") {
        throw `<Else> tags are only permitted as children of <If> elements`;
    }
    if (getAttributeContent(element, "declare") === "true") {
        ensureAChild(element);
        return new AST.AssignmentExpression(new AST.Identifier(element.name), parseExpectingResult(element.children[0]))
    }
    if (getAttributeContent(element, "init") === "true") {
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
    if (getAttributeContent(element, "call") === "true") {
        return new AST.CallExpression(new AST.Identifier(element.name), element.children.map(child => parseExpectingResult(child)));
    }
    if (element.children.length === 1) { // this is gonna be a member
        const callElement = findNearestCallElement(element)
        if (callElement) {
            return new AST.CallExpression(memberize(element, callElement, undefined), callElement.children.map(child => parseExpectingResult(child)));
        }
        return memberize(element, undefined, undefined);
    }
    // TODO: Check for function deceleration (<params> child), allow for explicit call="true" logic and stuff

    return new AST.CallExpression(new AST.Identifier(element.name), element.children.map(child => parseExpectingResult(child)));
}

function isCallElement(element) {
    if (getAttributeContent(element, "call") === "true") {
        return true;
    }
    if (getAttributeContent(element, "init") === "true" || getAttributeContent(element, "declare") === "true") {
        return false;
    }
    if (element.children.length > 1) {
        return true
    }
    if (element.children.length === 0) {
        return element.closure === "long";
    }
    return false;
}

function findNearestCallElement(element) {
    if (isCallElement(element)) {
        return element;
    }
    if (element.children.length === 0) { // can have zero <x/>, can't have greater than 1 cause then it would be a call element
        return false;
    }
    return findNearestCallElement(element.children[0]); // yay recursion
}

function memberize(element, deepestElement, parentsObject) { // this little fucker took forever
    if (element === deepestElement || element.children.length === 0) {
        return new AST.MemberExpression(parentsObject, new AST.Identifier(element.name))
    }
    if(parentsObject){
        return memberize(element.children[0], deepestElement, new AST.MemberExpression(parentsObject, new AST.Identifier(element.name)))
    }
    return memberize(element.children[0], deepestElement,  new AST.Identifier(element.name));
}

module.exports = parseHiAPL;
