const tokenStore = require('../../enum/tokens');
const Root = require('./Root');
const Element = require('./Element');
const Comment = require('./Comment');


function htmlParser(tokens) {
    let currentNode = new Root();
    const states = {
        inElement: "inElement",
        inOpener: "inOpener",
        inCloser: "inCloser",
        startOpenTag: "startOpenTag",
        startEndTag: "startEndTag",
        inAttribute: "inAttribute",
        inComment: "inComment"
    }
    let state = states.inElement;
    let args = [];

    const funcs = {
        [states.inElement]: (item) => {
            if (item.token === tokenStore.openTag) {
                return states.startOpenTag;
            }
            if (item.token === tokenStore.rawContent) {
                currentNode.content += item.content.join("");
                return;
            }
            if (item.token === tokenStore.beginCloseTag) {
                return states.startEndTag;
            }
            throw `Unexpected: ${item.token}`;
        },
        [states.startOpenTag]: (item) => {
            if (item.token === tokenStore.tagName) {
                const newEl = new Element(currentNode);
                newEl.name = item.content.join("");
                currentNode.children.push(newEl);
                currentNode = newEl;
                return states.inOpener;
            }
            if (item.token === tokenStore.commentStart) {
                const comment = new Comment(currentNode);
                currentNode.comments.push(comment);
                currentNode = comment;
                return states.inComment;
            }
            throw new SyntaxError('Expected tag name or comment start');

        },
        [states.inOpener]: (item) => {
            if (item.token === tokenStore.attributeName) {
                return [states.inAttribute, item.content.join("")]
            }
            if (item.token === tokenStore.closeTag) {
                return states.inElement;
            }
            if (item.token === tokenStore.endOpenWithCloseTagShorthand) {
                currentNode.closer = "short";
                return states.inCloser;
            }
            throw `Unexpected: ${item}`;
        },
        [states.inAttribute]: (item, attributeName) => {
            if (item.token === tokenStore.attributeValueString) {
                currentNode.attributes[attributeName] = {type: "string", content: item.content.join("")};
                return states.inOpener;
            }
            if (item.token === tokenStore.attributeValueReference) {
                currentNode.attributes[attributeName] = {type: "reference", content: item.content.join("")};
                return states.inOpener;
            }
            throw 'Expected a attribute value';
        },
        [states.startEndTag]: (item) => {
            if (item.token !== tokenStore.tagName) {
                throw 'Expected tag name after tag close'
            }
            if (currentNode.name !== item.content.join("")) {
                throw `<${currentNode.name}> was left open`
            }
            return states.inCloser;
        },
        [states.inCloser]: (item) => {
            if (item.token !== tokenStore.closeTag) {
                throw 'Expected close tag';
            }
            currentNode = currentNode.parent;
            return states.inElement;
        },
        [states.inComment]: (item) => {
            if (item.token === tokenStore.rawContent) {
                currentNode.content = item.content.join("");
                return;
            }
            if (item.token === tokenStore.commentEnd) {
                currentNode = currentNode.parent;
                return states.inElement;
            }
            throw `Unexpected item: ${item.name}`
        }
    }
    tokens.forEach(token => {
        const returnValue = funcs[state](token, ...args);
        args = [];
        if (!returnValue) {
            return;
        }
        if (Array.isArray(returnValue)) {
            state = returnValue.shift();
            args = returnValue;
            return;
        }
        state = returnValue;
    });
    if (currentNode.type !== "Root") {
        throw 'Elements were left open. Please close them.'
    }
    return currentNode;
}

module.exports = htmlParser;
