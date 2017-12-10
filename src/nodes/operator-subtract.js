const { TYPES } = require('./abstract-node');
const { AbstractBlockNode } = require('./abstract-block-node');


class OperatorSubtract extends AbstractBlockNode {
    constructor() {
        super(TYPES.Operators.Subtract, '-');
    }


    static get masks() { return [ /^-$/, 'minus' ]; }


    static interprete(content) {
        return content.children[0] - content.children[1];
    }


    isClosed() { return this.children.length === 2; }
}


module.exports = OperatorSubtract;
