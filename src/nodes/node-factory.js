const TerminalNode = require('./terminal-node');
const InteriorNode = require('./interior-node');
const { TYPES } = require('./constants');


const AVAILABLE_TYPES = Object.keys(TYPES).map(k => TYPES[k]);


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
    if (typeof classId === 'undefined' || typeof masks === 'undefined') {
        console.warn('new Parser(): omit a node configuration because it misses "classId" or "masks"', { classId, masks });
        return null;
    }

    if (AVAILABLE_TYPES.indexOf(type) === -1) {
        console.warn(`new Parser(): omit a node "${classId}" configuration because of bad "type"`, type);
        return null;
    }

    isCaseSensitive = typeof isCaseSensitive === 'undefined'
        ? globalIsCaseSensitive
        : !!isCaseSensitive;
    masks = (Array.isArray(masks) ? masks : [ masks ])
        .filter(mask => mask && (mask.constructor === RegExp) || (typeof mask === 'string'))
        .map(mask => typeof mask === 'string' && isCaseSensitive ? mask.toLowerCase() : mask);
    if (!masks.length) {
        console.warn(`new Parser(): omit a node "${classId}" configuration because of invalid "masks"`);
        return null;
    }

    return { classId, type, masks, isCaseSensitive, interpret, priority, isChildValid, isClosed };
}


/**
 * @param {String} content
 * @param {Object} nodeConfig
 * @return {TerminalNode}
 */
function createNode(content, nodeConfig) {
    switch (nodeConfig.type) {
        case TYPES.Infix:
            return new InteriorNode(content, nodeConfig);
        default:
    }
    return new TerminalNode(content, nodeConfig);
}


module.exports = { prepareNodeFromConfig, createNode };
