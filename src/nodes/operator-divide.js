const { TYPES } = require('./abstract-node');
const { AbstractBlockNode } = require('./abstract-block-node');


class OperatorDivide extends AbstractBlockNode {
    constructor() {
        super(TYPES.Operators.Divide, '/');
    }


    static get mask() { return /^(\/|div)$/i }


    static interprete(content) {
        return content.children[0] / content.children[1];
    }


    isClosed() { return this.children.length === 2; }
}


module.exports = OperatorDivide;
