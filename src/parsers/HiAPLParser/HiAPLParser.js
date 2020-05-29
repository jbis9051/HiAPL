const {Comment, Node} = require('../HTMLParser');
const AST = require('../ast');

const numberRegex = /^[0-9]+(\.[0-9]+)?$/;

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

function ensureAChild(element) {
    if (element.children.length !== 1) {
        throw `Expected a child for element ${element.name}`
    }
}

function getObjectExpression(element) {
    const properties = [];
    Object.entries(element.attributes).forEach(([key, value]) => {
        if (key === "init" || key === "declare") {
            return;
        }
        properties.push(new AST.Property(new AST.Literal(key), parseAttrValue(value.content)))
    });
    return new AST.ObjectExpression(properties);
}

function parseAttrValue(value) {
    if (value.type === "string") {
        return new AST.Literal(value);
    }
    const content = value;
    if (content === "true" || content === "false") {
        return new AST.Literal(content === "true");
    }
    if (content.match(numberRegex)) {
        return new AST.Literal(parseFloat(content));
    }
    return new AST.Identifier(content);
}


function parseHiAPL(HTMLRoot) {
    return new AST.Program(HTMLRoot.children.map(child => parseBlock(child)));
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
        if (node.closer === "short") { // object deceleration
            return new AST.VariableDeclaration([new AST.VariableDeclarator(new AST.Identifier(node.name), getObjectExpression(node))]);
        }
        ensureAChild(node);
        return new AST.VariableDeclaration([new AST.VariableDeclarator(new AST.Identifier(node.name), parseExpectingResult(node.children[0]))]);
    }
    const params = node.children.filter(child => child.name === "params");
    if(node.name === "func" || params.length > 0){
        return parseFunction(node, false);
    }
    return new AST.ExpressionStatement(parseExpectingResult(node));
}

function parseFunction(element, expression) {
    const paramsChildren = element.children.filter(child => child.name === "params");
    if(!paramsChildren){
        throw 'Expected one <params>';
    }
    const params = parseParams(paramsChildren[0].children);

    const body = new AST.BlockStatement(
        element.children
        .filter(child => child !== paramsChildren[0])
        .map(child => parseBlock(child))
    );

    if(element.name === "func"){ // is anonymous
        if(!expression){
            throw 'Anonymous functions are not allowed here';
        }
        if(getAttributeContent(element, "arrow") === "true"){
            return new AST.ArrowFunctionExpression(params, body)
        }
        return new AST.FunctionExpression(null, params, body)
    }
    return new AST.FunctionDeclaration(new AST.Identifier(element.name), params, body)
}

function parseParams(elements) {
    return elements.map(param => {
        if(param.name !== "param"){
            throw 'Only <param> tags are allowed in a <params> tag';
        }
        const content = param.content;
        if(content.match(/\s/)){
            throw 'Paramerters cannot have spaces';
        }
        return new AST.Identifier(content);
    });
}

function parseExpectingResult(element, options = {}) {
    if (Object.keys(reservedTags).includes(element.name)) {
        throw `Unexpected ${element.name}`;
    }
    const params = element.children.filter(child => child.name === "params");
    if(element.name === "func" || params.length > 0){
        return parseFunction(element, true);
    }
    if (specialTags.includes(element.name)) {
        throw `Special Tag: ${element.name} not allowed here`;
    }
    if (element.name === "Else") {
        throw `<Else> tags are only permitted as children of <If> elements`;
    }
    if (getAttributeContent(element, "assign") === "true") {
        ensureAChild(element);
        return new AST.AssignmentExpression(new AST.Identifier(element.name), parseExpectingResult(element.children[0]))
    }
    if (getAttributeContent(element, "init") === "true") {
        throw 'Syntax Error: You cannot initialize a variable here.';
    }
    if (element.closer === "short") {
        return new AST.Identifier(element.name);
    }
    if (element.name === "arg") {
        let value = element.content;
        if (value.match(numberRegex) && !(getAttributeContent(element, "string") === "true")) {
            value = parseFloat(value);
        }
        return new AST.Literal(value);
    }
    if (isCallElement(element)) {
        return new AST.CallExpression(new AST.Identifier(element.name), element.children.map(child => parseExpectingResult(child)));
    }
    if (element.children.length === 1) { // this is gonna be a member
        const callElement = findNearestCallElement(element)
        if (callElement) {
            return new AST.CallExpression(memberize(element, callElement, undefined), callElement.children.map(child => parseExpectingResult(child)));
        }
        return memberize(element, undefined, undefined);
    }

    return new AST.CallExpression(new AST.Identifier(element.name), element.children.map(child => parseExpectingResult(child)));
}

function isCallElement(element) {
    if (getAttributeContent(element, "call") === "true") {
        return true;
    }
    if (getAttributeContent(element, "init") === "true" || getAttributeContent(element, "assign") === "true") {
        return false;
    }
    if (element.children.length > 1) {
        return true
    }
    if (element.children.length === 0) {
        return element.closer === "long";
    }
    if (element.children.length === 1 && (element.children[0].closer === "short" || element.children[0].name === "arg")) {
        return true;
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
    if (parentsObject) {
        return memberize(element.children[0], deepestElement, new AST.MemberExpression(parentsObject, new AST.Identifier(element.name)))
    }
    return memberize(element.children[0], deepestElement, new AST.Identifier(element.name));
}

module.exports = parseHiAPL;
