const BEHAVIOR_TYPES = {
    // terminal leaves fo node tree
    Leaf: 'leaf',
    Terminal: 'leaf',

    Infix: 'infix',
    Prefix: 'prefix',
    Postfix: 'postfix',

    Block: {
        Open: 'block-open',
        Close: 'block-close',
    }
};


const BEHAVIORS = {
    [ BEHAVIOR_TYPES.Infix ]: {
        isClosed() { return this.children.length === 2; },
        isChildAllowed(child) { return true; },
    },
    [ BEHAVIOR_TYPES.Prefix ]: {
        isClosed() { return this.children.length === 1; },
        isChildAllowed(child) { return true; },
    },
    [ BEHAVIOR_TYPES.Postfix ]: {
        isClosed() { return this.children.length === 1; },
        isChildAllowed(child) { return true; },
    },
};


module.exports = { BEHAVIOR_TYPES, BEHAVIORS };
