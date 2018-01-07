const { AbstractMask, MASK_TYPES } = require('./abstract-mask');


class RegExpMask extends AbstractMask {
    constructor(mask) {
        super(mask);
        this.type = MASK_TYPES.RegExp;
    }


    match(sequence) {
        let string = '';

        for (let i = 0; i < sequence.length; i++) {
            if (typeof sequence[i] !== 'string') {
                return false;
            }
            string += sequence[i];
        }

        return (this.value.exec(string) || [])[0] === string;
    }
}


module.exports = { RegExpMask };
