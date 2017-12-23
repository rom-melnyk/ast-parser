const { TYPES } = require('../src/nodes/constants');


const CLASS_IDS = {
    Text: 'text',
    Number: 'number',
    Operators: {
        Add: '+',
        Subtract: '-',
        Multiply: '*',
        Divide: '/'
    }
};


const nodes = [
    {
        classId: CLASS_IDS.Number,
        type: TYPES.Terminal,
        masks: /[0-9]+/,
        interpret() { return +this.content; },
    },

    {
        classId: CLASS_IDS.Operators.Add,
        type: TYPES.Infix,
        masks: [ '+', 'plus' ],
        interpret() { return this.children[0].interpret() + this.children[1].interpret(); },
        priority: 10
    },
    {
        classId: CLASS_IDS.Operators.Subtract,
        type: TYPES.Infix,
        masks: [ '-', 'minus' ],
        interpret() { return this.children[0].interpret() - this.children[1].interpret(); },
        priority: 10
    },
    {
        classId: CLASS_IDS.Operators.Multiply,
        type: TYPES.Infix,
        masks: [ '*', 'mul', 'x' ],
        interpret() { return this.children[0].interpret() * this.children[1].interpret(); },
        priority: 100
    },
    {
        classId: CLASS_IDS.Operators.Divide,
        type: TYPES.Infix,
        masks: [ '/', 'div' ],
        interpret() { return this.children[0].interpret() / this.children[1].interpret(); },
        priority: 100
    },
];


module.exports = { nodes, CLASS_IDS };
