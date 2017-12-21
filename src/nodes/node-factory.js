const TerminalNode = require('./terminal-node');
const InteriorNode = require('./interior-node');
const { TYPES } = require('./constants');


const AVAILABLE_TYPES = Object.keys(TYPES).map(k => TYPES[k]);

let noClassIDCounter = 0;


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
    if (typeof masks === 'undefined') {
        console.warn('new Parser(): omit a node configuration because it misses "classId" or "masks":', { classId, masks });
        return null;
    }

    if (AVAILABLE_TYPES.indexOf(type) === -1) {
        console.warn(`new Parser(): omit a node configuration because of bad "type":`, type);
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
        console.warn(`new Parser(): omit a node "${classId}" configuration because of invalid "masks":`, originalMasks);
        return null;
    }
    originalMasks = null;

    if (typeof classId === 'undefined') { // TODO check duplicates here as well
        classId = `${type}___${masks[0].toString()}___${noClassIDCounter}`;
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
