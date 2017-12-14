const TerminalNode = require('./terminal-node');


class BlockNode extends TerminalNode {
    constructor(type, content, { interpret, isChildAllowed, isClosed }) {
        super(type, content, { interpret });
        this.children = [];

        this.isClosed = typeof isClosed === 'function' ? isClosed : () => this.children.length === 2;
        this.isChildAllowed = typeof isChildAllowed === 'function' ? isChildAllowed : () => true;
    }


    addChild(child) {
        if (this.children.indexOf(child) === -1 && child instanceof TerminalNode) {
            child.parent = this;
            this.children.push(child);
            child.path = this;
        }
    }


    removeChild(child) {
        const index = this.children.indexOf(child);
        return this.removeChildByIndex(index);
    }


    removeChildByIndex(index) {
        if (this.children[index]) {
            this.children[index].parent = null;
            const child = this.children.splice(index, 1)[0];
            child.parent = null;
            return child;
        }
        return undefined;
    }
}


module.exports = BlockNode;
