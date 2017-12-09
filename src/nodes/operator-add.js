const { TYPES } = require('./abstract-node');
const { AbstractBlockNode } = require('./abstract-block-node');


class OperatorAdd extends AbstractBlockNode {
    constructor() {
        super(TYPES.Operators.Add, '+');
    }


    static get mask() { return /^\+|plus$/i }


    static interprete(content) {
        return content.children[0] + content.children[1];
    }


    isClosed() { return this.children.length === 2; }
}


module.exports = OperatorAdd;
