const MASK_TYPES = {
    String: 'string',
    RegExp: 'regexp',
    OneOf: 'one-of',

};

let counter = -1;

class AbstractMask {
    constructor(mask) {
        this.value = mask;
        this.stringValue = this.value.toString();
        this.id = ++counter;
        this.type = null; // will be overridden
    }

    /**
     * @param {String|Array} sequence
     * @return {boolean|number}     `false` if no match, `true` for partial match, mask id for full match
     */
    match(sequence) {
        throw new Error('The method ".match()" must be overridden');
    }
}


module.exports = { AbstractMask, MASK_TYPES };
