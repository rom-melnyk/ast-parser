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
        interpret({ content, children }) { return +content; }
    },

    {
        type: TYPES.Operators.Add,
        masks: [ '+', 'plus' ],
        interpret({ content, children }) { return children[0] + children[1]; }
    },
    {
        type: TYPES.Operators.Subtract,
        masks: [ '-', 'minus' ],
        interpret({ content, children }) { return children[0] - children[1]; }
    },
    {
        type: TYPES.Operators.Multiply,
        masks: [ '*', 'mul', 'x' ],
        interpret({ content, children }) { return children[0] * children[1]; }
    },
    {
        type: TYPES.Operators.Divide,
        masks: [ '/', 'div' ],
        interpret({ content, children }) { return children[0] / children[1]; }
    },
];


module.exports = { TYPES, NodesConfig };