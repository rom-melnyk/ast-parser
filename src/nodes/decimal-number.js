const { TYPES, AbstractNode } = require('./abstract-node');


class DecimalNumber extends AbstractNode {
    constructor(content) {
        super(TYPES.Number, content);
    }


    static get masks() { return /^[0-9]+$/ }


    static interprete(content) { return +content; }
}


module.exports = DecimalNumber;
