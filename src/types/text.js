const { TYPES, AbstractType } = require('./abstract-type');


class Text extends AbstractType{
    constructor(content) {
        super(TYPES.Text, content, () => this.content);
    }

    // all the children operations make no sense in Text class
    addChild() {}
    removeChild() {}
    removeChildByIndex() {}
}


module.exports = Text;
