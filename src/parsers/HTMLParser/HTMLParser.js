const tokenStore = require('../../enum/tokens');
const Root = require('./Root');
const Element = require('./Element');


function htmlParser(tokens) {
    let currentElement = new Root();
    const states = {
        inElement: "inElement", //
        inOpener: "inOpener", //
        inCloser: "inCloser", //
        startOpenTag: "startOpenTag", //
        startEndTag: "startEndTag", //
        inAttribute: "inAttribute" //
    }
    let state = states.inElement;
    let args = [];

    const funcs = {
        [states.inElement]: (item) => {
            if(item.token === tokenStore.openTag){
                const newEl = new Element(currentElement);
                currentElement.children.push(newEl);
                currentElement = newEl;
                return states.startOpenTag;
            }
            if(item.token === tokenStore.rawContent){
                currentElement.content = item.content.join("");
                return;
            }
            if(item.token === tokenStore.beginCloseTag){
                return states.startEndTag;
            }
            throw `Unexpected: ${item.token}`;
        },
        [states.startOpenTag]: (item) => {
            if (item.token !== tokenStore.tagName) {
                throw new SyntaxError('Expected tag name');
            }
            currentElement.name = item.content.join("");
            return states.inOpener;
        },
        [states.inOpener]: (item) => {
            if(item.token === tokenStore.attributeName){
                return [states.inAttribute, item.content.join("")]
            }
            if(item.token === tokenStore.closeTag){
                return states.inElement;
            }
        },
        [states.inAttribute]: (item, attributeName) => {
            if(item.token === tokenStore.attributeValueString) {
                currentElement.attributes[attributeName] = {type: "string", content: item.content.join("")};
                return states.inOpener;
            }
            if(item.token !== tokenStore.attributeValueReference){
                currentElement.attributes[attributeName] = {type: "reference", content: item.content.join("")};
                return states.inOpener;
            }
            throw 'Expected a attribute value';
        },
        [states.startEndTag]: (item) => {
            if(item.token !== tokenStore.tagName){
                throw 'Expected tag name after tag close'
            }
            if(currentElement.name !== item.content.join("")){
                throw `<${currentElement.name}> was left open`
            }
            return states.inCloser;
        },
        [states.inCloser]: (item) => {
            if(item.token !== tokenStore.closeTag){
                throw 'Expected close tag';
            }
            currentElement = currentElement.parent;
            return states.inElement;
        }
    }
    tokens.forEach(token => {
        console.log(state)
        const returnValue = funcs[state](token, ...args);
        args = [];
        if(!returnValue){
            return;
        }
        if(Array.isArray(returnValue)){
            state = returnValue.shift();
            args = returnValue;
            return;
        }
        state = returnValue;
    });
    if(currentElement.type !== "Root"){
        throw 'Elements were left open. Please close them.'
    }
    return currentElement;
}

module.exports = htmlParser;
