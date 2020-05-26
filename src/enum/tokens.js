//  <tag attribute="value">Content</tag>


module.exports = {
    openTag: 'openTag', // <

    tagName: 'tagName', // tag

    attributeName: 'attributeName', // attribute
    attributeValueString: 'attributeValueString', // value
    attributeValueReference: 'attributeValueReference', // value but a reference to a variable or something

    closeTag: 'closeTag', // >

    beginCloseTag: 'beginCloseTag', // </
    endOpenWithCloseTagShorthand: 'endOpenWithCloseTagShorthand', // />

    rawContent: 'rawContent', // Content

    commentStart: 'commentStart',
    commentEnd: 'commentEnd',

};
