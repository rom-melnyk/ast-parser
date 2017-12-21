const InteriorNode = require('./interior-node');


class InfixOperator extends InteriorNode {
    isClosed() {
        return this.children.length === 2;
    }
}


module.exports = InfixOperator;
