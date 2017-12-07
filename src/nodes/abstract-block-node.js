const { AbstractNode } = require('./abstract-node');


class AbstractBlockNode extends AbstractNode {
    constructor(type, content) {
        super(type, content);
        this.children = [];
    }


    addChild(child) {
        if (this.children.indexOf(child) === -1 && child instanceof AbstractNode) {
            this.children.push(child);
            child.path = this;
        }
    }


    removeChild(child) {
        const index = this.children.indexOf(child);
        this.removeChildByIndex(index);
    }


    removeChildByIndex(index) {
        if (this.children[index]) {
            this.children[index].parent = null;
            this.children.splice(index, 1);
        }
    }


    isClosed() { return false; } // the condition when parser understands this node is closed
}


module.exports = { AbstractBlockNode };
