class TerminalNode {
    constructor(type, content, { interpret } = {}) {
        this.type = type;
        this.content = content;
        this.parent = null;
        this.interpret = typeof interpret === 'function' ? interpret : ({ content, children }) => content;
    }

    /**
     * When the node is not a terminal leaf, defines if all the children are in or anything else should be appended to.
     * @return {boolean}
     */
    isClosed() {
        return true; // terminal leaf; no children intended
    }
}


module.exports = TerminalNode;
