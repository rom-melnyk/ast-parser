const TYPES = {
    Text: 'text',
    Var: 'var',
};


class AbstractType {
    constructor(type, content, processor) {
        this.type = type;
        this.content = content;
        this.children = [];
        this.processor = processor;
    }

    addChild(child) {
        if (this.children.indexOf(child) === -1) {
            this.children.push(child);
        }
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    removeChildByIndex(index) {
        if (this.children[index]) {
            this.children.splice(index, 1);
        }
    }
}


module.exports = { TYPES, AbstractType };
