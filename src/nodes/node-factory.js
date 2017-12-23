const TerminalNode = require('./terminal-node');
const InfixOperator = require('./infix-operator');
const { TYPES } = require('./constants');


const AVAILABLE_TYPES = Object.keys(TYPES).map(k => TYPES[k]);
const NOT_RECOGNIZED_NODE = {
    classId: '@@System@@___not-recognized',
    type: TYPES.NotRecognized,
    masks: /.*/, // the last hope if nothing else matches; a candidate for SyntaxError
};
const WHITESPACE_NODE = {
    classId: '@@System@@___whitespace',
    type: TYPES.Whitespace,
    masks: /\s+/, // this might be overridden
};

let noClassIdCounter = 0;


function prepareNodeFromConfig(
    {
        classId, type,
        masks, isCaseSensitive,
        interpret,
        priority,
        isChildValid, isClosed
    } = {},
    globalIsCaseSensitive
) {
    if (AVAILABLE_TYPES.indexOf(type) === -1) {
        console.warn(`new Parser(): omit a node configuration because of invalid ".type":`, type);
        return null;
    }

    isCaseSensitive = typeof isCaseSensitive === 'undefined'
        ? globalIsCaseSensitive
        : !!isCaseSensitive;

    let originalMasks = masks;
    masks = (Array.isArray(masks) ? masks : [ masks ])
        .filter(mask => mask && (mask.constructor === RegExp) || (typeof mask === 'string'))
        .map(mask => typeof mask === 'string' && isCaseSensitive ? mask.toLowerCase() : mask);
    if (!masks.length) {
        console.warn(`new Parser(): omit a node configuration because of invalid ".masks":`, originalMasks);
        return null;
    }
    originalMasks = null;

    if (typeof classId === 'undefined') { // TODO check duplicates here as well
        classId = `${type}___${masks[0].toString()}___${noClassIdCounter++}`;
    }

    return { classId, type, masks, isCaseSensitive, interpret, priority, isChildValid, isClosed };
}


function getWhitespaceNode(masks) {
    const config = masks ? Object.assign({}, WHITESPACE_NODE, { masks }) : WHITESPACE_NODE;
    return prepareNodeFromConfig(config);
}


function getNotRecognizedNode() {
    return prepareNodeFromConfig(NOT_RECOGNIZED_NODE);
}


/**
 * @param {String} content
 * @param {Object} nodeConfig
 * @return {TerminalNode}
 */
function createNode(content, nodeConfig) {
    switch (nodeConfig.type) {
        case TYPES.Infix:
            return new InfixOperator(content, nodeConfig);
        default:
    }
    return new TerminalNode(content, nodeConfig);
}


module.exports = { prepareNodeFromConfig, getWhitespaceNode, getNotRecognizedNode, createNode };
