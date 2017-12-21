const TerminalNode = require('./terminal-node');


class InteriorNode extends TerminalNode {
    constructor(content, { classId, type, priority, interpret, isChildValid, isClosed }) {
        super(content, { classId, type, interpret, isClosed });
        this.children = [];
        this.priority = priority || 0;

        if (typeof isChildValid === 'function') {
            this.isChildValid = isChildValid;
        }
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


    /**
     * Checks if given node is suitable as current node's child.
     * @param {TerminalNode} childNode
     * @return {boolean}
     */
    isChildValid(childNode) {
        return true; // any child is valid
    }
}


module.exports = InteriorNode;
