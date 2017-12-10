const { TYPES } = require('./abstract-node');
const { AbstractBlockNode } = require('./abstract-block-node');


class OperatorMultiply extends AbstractBlockNode {
    constructor() {
        super(TYPES.Operators.Multiply, '*');
    }


    static get masks() { return [ '*', 'mul', 'x' ]; }


    static interprete(content) {
        return content.children[0] * content.children[1];
    }


    isClosed() { return this.children.length === 2; }
}


module.exports = OperatorMultiply;
