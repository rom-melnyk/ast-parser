const BEHAVIORS = {
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


module.exports = { BEHAVIORS };
