const tokens = require('./enum/tokens');

const states = {
    startDoc: 'startDoc',

    tagOpen: 'tagOpen', // <
    tagName: 'tagName', // tag
    attributeName: 'attributeName', // attribute
    afterAttributeName: 'afterAttributeName',

    attributeNoQuoteValue: 'attributeNoQuoteValue', // value
    // "
    attributeValue: 'attributeValue', // value
    // "

    afterAttribute: 'afterAttribute',

    tagClose: 'tagClose', // >

    tagContent: 'tagContent', // Content

    endTagOpen: 'endTagOpen', // <
    // /
    endTagName: 'endTagName', // tag
    endTagClose: 'endTagName', // >

    endSelfClosingTag: 'endSelfClosingTag', // /

    commentContent: 'commentContent'

}


/**
 *
 * @param {String} input
 * @param {function} consumer
 */
function lexer(input, consumer) {
    input = input.trim();
    if (!input.startsWith("<!DOCTYPE hiapl>")) { // TODO should be done in parser
        throw new SyntaxError("HiAPL files require a HiAPL doctype deceleration");
    }
    input = input.replace(/^<!DOCTYPE hiapl>/, "");

    const chars = Array.from(input);

    const position = {
        line: 1,
        char: 1,
    }

    let state = states.startDoc;
    let content = [];

    function emit(token) {
        consumer({
            token: token,
            content: content,
            position: Object.assign({}, position)
        });
        content = [];

    }

    const funcs = {
        [states.startDoc]: (char) => {
            if(char === "<"){
                state = states.tagOpen;
                return;
            }
        },
        [states.tagOpen]: (char) =>{ // <[char]
            if(char === "/"){
                state = states.tagName;
                emit(tokens.beginCloseTag);
                return;
            }
            emit(tokens.openTag);
            state = states.tagName;
            content.push(char);
        },
        [states.tagName]: (char) => { // tag
            if(char === ">"){ // tag>
                emit(tokens.tagName);
                state = states.tagClose;
                emit(tokens.closeTag);
                return;
            }
            if(char === "/"){ // tag/
                emit(tokens.tagName);
                emit(tokens.endOpenWithCloseTagShorthand);
                state = states.endSelfClosingTag;
                return;
            }
            if(char === " "){
                if(content.join("") === "!--"){
                    emit(tokens.commentStart);
                    state = states.commentContent;
                    return;
                }
                emit(tokens.tagName);
                state = states.attributeName;
                return;
            }
            content.push(char);
        },
        [states.attributeName]: (char) => {
            if(char === " "){ // tag>
                emit(tokens.attributeName);
                return;
            }
            if(char === "="){ // tag/
                emit(tokens.attributeName);
                state = states.afterAttributeName;
                return;
            }
            if(char === "/"){
                emit(tokens.attributeName);
                emit(tokens.endOpenWithCloseTagShorthand);
                state = states.endSelfClosingTag;
                return;
            }
            content.push(char);
        },
        [states.afterAttributeName]: (char) => {
            if(char === '"'){
                state = states.attributeValue;
                return;
            }
            if(char === " "){
                throw 'Syntax error. Expecting value at ' + position.toString();
            }
            state = states.attributeNoQuoteValue; // TODO
            content.push(char);
        },
        [states.attributeValue]: (char) => {
            if(char === '"'){
                emit(tokens.attributeValueString);
                state = states.afterAttribute
                return;
            }
            content.push(char);
        },
        [states.attributeNoQuoteValue]: (char) => {
            if(char === " "){
                emit(tokens.attributeValueReference);
                state = states.afterAttribute;
                return;
            }
            content.push(char);
        },
        [states.afterAttribute]: (char) => {
            if(char === " ") return;
            if(char === ">"){
                state = states.tagClose;
                emit(tokens.closeTag);
                return;
            }
            if(char === "/"){
                emit(tokens.endOpenWithCloseTagShorthand);
                state = states.endSelfClosingTag;
                return;
            }
            state = states.attributeName;
            content.push(char);
        },
        [states.tagClose]: (char) => {
            if(char === "<"){
                state = states.tagOpen;
                return;
            }
            content.push(char);
            state = states.tagContent;
        },
        [states.tagContent]: (char) => {
            if(char === "<"){
                emit(tokens.rawContent);
                state = states.tagOpen;
                return;
            }
            content.push(char)
        },
        [states.endSelfClosingTag]: (char) => {
            if(char === ">"){
                state = states.tagClose;
                emit(tokens.closeTag)
                return;
            }
            throw 'Expected a ">" after a self closing tag slash: ' + position.toString()
        },
        [states.commentContent]: (char) => {
            content.push(char);
            if(content.join("").endsWith("-->")){
                content = content.slice(0, content.length - "-->".length)
                emit(tokens.rawContent)
                emit(tokens.commentEnd)
                state = states.tagClose;
                return;
            }
        }
    }

    chars.forEach((char, index) => {
        if(char === "\n"){
            position.line++;
            position.char = 1;
        }
        const func = funcs[state];
        if(!func){
            return;
        }
        func(char);
        position.char++;
    });


}

module.exports = lexer;
