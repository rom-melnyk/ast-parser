const { BEHAVIOR_TYPES, BEHAVIORS } = require('./behaviors');


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
        interpret() { return +this.content; },
        priority: 10
    },

    {
        type: TYPES.Operators.Add,
        masks: [ '+', 'plus' ],
        behavior: BEHAVIOR_TYPES.Infix,
        interpret() { return this.children[0].interpret() + this.children[1].interpret(); },
        priority: 100
    },
    {
        type: TYPES.Operators.Subtract,
        masks: [ '-', 'minus' ],
        behavior: BEHAVIOR_TYPES.Infix,
        interpret() { return this.children[0].interpret() - this.children[1].interpret(); },
        priority: 100
    },
    {
        type: TYPES.Operators.Multiply,
        masks: [ '*', 'mul', 'x' ],
        behavior: BEHAVIOR_TYPES.Infix,
        interpret() { return this.children[0].interpret() * this.children[1].interpret(); },
        priority: 1000
    },
    {
        type: TYPES.Operators.Divide,
        masks: [ '/', 'div' ],
        behavior: BEHAVIOR_TYPES.Infix,
        interpret() { return this.children[0].interpret() / this.children[1].interpret(); },
        priority: 1000
    },
];


module.exports = { TYPES, NodesConfig };
