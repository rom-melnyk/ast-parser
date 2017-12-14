const TerminalNode = require('./terminal-node');
const BlockNode = require('./block-node');
const { BEHAVIOR_TYPES, BEHAVIORS } = require('../behaviors');


function prepareNodeFromConfig(
    {
        type, masks, isCaseSensitive,
        behavior,
        priority,
        interpret,
        isClosed, isChildAllowed
    } = {},
    globalIsCaseSensitive
) {
    if (typeof type === 'undefined' || typeof masks === 'undefined') {
        console.warn('new Parser(): omit a node from configuration because it misses "type" or "masks"');
        return null;
    }

    isCaseSensitive = typeof isCaseSensitive === 'undefined'
        ? globalIsCaseSensitive
        : !!isCaseSensitive;
    masks = (Array.isArray(masks) ? masks : [ masks ])
        .filter(mask => mask && (mask.constructor === RegExp) || (typeof mask === 'string'))
        .map(mask => typeof mask === 'string' && isCaseSensitive ? mask.toLowerCase() : mask);
    if (!masks.length) {
        console.warn(`new Parser(): omit a node "${type}" from configuration because it has invalid "masks"`);
        return null;
    }

    return { type, masks, isCaseSensitive, behavior, priority, interpret, isClosed, isChildAllowed };
}


function createNode({ type, interpret, behavior }, content) {
    switch (behavior) {
        case BEHAVIOR_TYPES.Infix:
            const methods = Object.assign({ interpret }, BEHAVIORS[BEHAVIOR_TYPES.Infix]);
            return new BlockNode(type, content, methods);
        default:
    }
    return new TerminalNode(type, content, { interpret });
}


module.exports = { prepareNodeFromConfig, createNode };
