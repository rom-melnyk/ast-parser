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


    /**
     * @override
     * Describe how node should look like. If node is strictly determined, use String or String[].
     * If node definition requires RegExp, make sure RegExp matches full string (`/^...$/`) and defines case sensitivity.
     * @return {[String|RegExp]}
     */
    static get masks() { return [ /.*/ ]; }


    /**
     * @override
     * Whether to respect case whilst parsing or not.
     * This flag does not **affect** the RegExp in `masks`;
     * the RegExp itself must define case sensitivity: `/^alpha$/` vs. `/^alpha$/i`.
     * @return {boolean}
     */
    static get isCaseSensitive() { return false; }


    /**
     * Decides if given text matches the node.
     * @param text
     * @return {boolean}
     */
    static match(text) {
        const isCaseInsensitive = !this.isCaseSensitive;
        if (!this['@@__masks__@@']) {
            const masks = Array.isArray(this.masks) ? this.masks : [ this.masks ];

            this['@@__masks__@@'] = masks
                .filter(mask => mask && (mask.constructor === RegExp) || (typeof mask === 'string'))
                .map(mask => typeof mask === 'string' && isCaseInsensitive ? mask.toLowerCase() : mask)
        }
        if (isCaseInsensitive) {
            text = text.toLowerCase();
        }

        return this['@@__masks__@@'].some(mask =>
            mask.constructor === RegExp
                ? mask.test(text)
                : mask.length >= text.length
                    ? mask.substr(0, text.length) === text
                    : false
        )

    }


    /**
     * @override
     * Defines how to interpret current node (e.g., if node is "+" then add both it's children).
     * @return {*}
     */
    interpret() { return this.content; }


    /**
     * When the node is not a terminal leaf, defines if all the children are in or anything else should be appended to.
     * @return {boolean}
     */
    isClosed() {
        return true; // terminal leaf; no children intended
    }
}


module.exports = { TYPES, AbstractNode };
