const { AbstractMask, MASK_TYPES } = require('./abstract-mask');


class StringMask extends AbstractMask {
    constructor(mask) {
        super(mask);
        this.type = MASK_TYPES.String;
    }


    match(sequence) {
        if (sequence.length > this.value.length) {
            return false;
        }

        for (let i = 0; i < sequence.length; i++) {
            if (typeof sequence[i] !== 'string' || sequence[i] !== this.value[i]) {
                return false;
            }
        }

        return this.value.length === sequence.length ? this.id : true;
    }
}


module.exports = { StringMask };
