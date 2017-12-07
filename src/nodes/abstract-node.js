const TYPES = {
    Text: 'text',
    Var: 'var',
    Number: 'number',
    Operators: {
        Add: '+',
        Subtract: '-',
        Multiply: '*',
        Divide: '/'
    }
};


class AbstractNode {
    constructor(type, content) {
        this.type = type;
        this.content = content;
        this.parent = null;
    }


    static get mask() { return  /.*/; }


    static interprete(content) { return  content; }


    isClosed() { return true; } // terminal element; no children intended
}


module.exports = { TYPES, AbstractNode };
