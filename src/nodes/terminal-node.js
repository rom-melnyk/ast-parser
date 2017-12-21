class TerminalNode {
    constructor(content, { classId, type, interpret, isClosed } = {}) {
        this.classId = classId;
        this.type = type;
        this.content = content;
        this.parent = null;

        if (typeof interpret === 'function') {
            this.interpret = interpret;
        }
        if (typeof isClosed === 'function') {
            this.interpret = isClosed;
        }
    }


    /**
     * How to interpret the node
     * @return {*}
     */
    interpret() {
        return this.content;
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
