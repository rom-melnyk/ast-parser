const TYPES = {
    Leaf: 'leaf',
    Terminal: 'leaf', // alias

    Prefix: 'prefix',
    Infix: 'infix',
    Postfix: 'postfix',

    Block: 'block',

    Whitespace: 'whitespace', // something to ignore unless treated specifically on the parent level
    NotRecognized: 'not-recognized', // a candidate for SyntaxError
};


module.exports = { TYPES };
