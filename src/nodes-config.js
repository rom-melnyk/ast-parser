const { BEHAVIORS } = require('./constants');


const TYPES = {
    Text: 'text',
    Var: 'var',
    Number: 'number',
    Operators: {
        Add: '+',
        Subtract: '-',
        Multiply: '*',
        Divide: '/'
    }
};


const NodesConfig = [
    {
        type: TYPES.Number,
        masks: /^[0-9]+$/,
        interpret({ content, children }) { return +content; },
        priority: 10
    },

    {
        type: TYPES.Operators.Add,
        masks: [ '+', 'plus' ],
        behavior: BEHAVIORS.Infix,
        interpret({ content, children }) { return children[0] + children[1]; },
        priority: 100
    },
    {
        type: TYPES.Operators.Subtract,
        masks: [ '-', 'minus' ],
        behavior: BEHAVIORS.Infix,
        interpret({ content, children }) { return children[0] - children[1]; },
        priority: 100
    },
    {
        type: TYPES.Operators.Multiply,
        masks: [ '*', 'mul', 'x' ],
        behavior: BEHAVIORS.Infix,
        interpret({ content, children }) { return children[0] * children[1]; },
        priority: 1000
    },
    {
        type: TYPES.Operators.Divide,
        masks: [ '/', 'div' ],
        behavior: BEHAVIORS.Infix,
        interpret({ content, children }) { return children[0] / children[1]; },
        priority: 1000
    },
];


module.exports = { TYPES, NodesConfig };
