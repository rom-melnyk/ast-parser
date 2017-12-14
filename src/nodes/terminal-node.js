class Node {
    constructor(type, content, interpret) {
        this.type = type;
        this.content = content;
        this.parent = null;
        this.interpret = interpret;
    }

    /**
     * When the node is not a terminal leaf, defines if all the children are in or anything else should be appended to.
     * @return {boolean}
     */
    isClosed() {
        return true; // terminal leaf; no children intended
    }
}


module.exports = Node;
