const Node = require('./node');


// const NEW_LINE = /\n/;
const SURROUNDING_LENGTH = 10; // when exposing an error, how many chars around to show


/**
 * Throw a SyntaxError or console.warn a message.
 */
function handleError(ignoreErrors, { char, i, input }) {
    const msg = `Unrecognizable char "${char}" at #${i + 1}`;
    if (!ignoreErrors) {
        throw new SyntaxError(msg);
    }

    const from = Math.max(0, i - SURROUNDING_LENGTH);
    const to = Math.min(input.length, i + SURROUNDING_LENGTH + 1);
    const surrounding = input.substr(from, to);
    console.warn(`${msg}:`);
    console.warn(`${ from === 0 ? '' : '...' }${surrounding}${ to === input.length ? '' : '...'}`);
    console.warn(Array( from === 0 ? i : (SURROUNDING_LENGTH + 3 /*...*/) ).fill(' ').join('') + '^');
}


/**
 * Decides if given text matches any of given masks.
 * @param {string} text
 * @param {Array<string|RegExp>} masks
 * @param {boolean} isCaseSensitive
 * @return {boolean}
 */
function matchAnyMask(text, masks, isCaseSensitive) {
    if (!isCaseSensitive) {
        text = text.toLowerCase();
    }

    return masks.some(mask =>
        mask.constructor === RegExp
            ? mask.test(text)
            : mask.length >= text.length // string
                ? mask.substr(0, text.length) === text
                : false
    );
}



class Parser {
    /**
     * @param {boolean} [isCaseSensitive=false]
     * @param {boolean} [ignoreErrors=false]
     * @param {Object[]} nodes                      nodes configuration
     * @param {RegExp} [whitespace=/\s|\n/]         whitespace mask; it will be skipped unless belong to a node
     */
    constructor({ isCaseSensitive = false, ignoreErrors = false, nodes = [], whitespace = /\s|\n/ } = {}) {
        let globalIsCaseSensitive = isCaseSensitive;
        this.isCaseSensitive = isCaseSensitive;
        this.ignoreErrors = ignoreErrors;
        this.whitespace = whitespace;
        this.nodes = nodes
            .map(({ type, masks, isCaseSensitive, priority, interpret } = {}) => {
                if (typeof type === 'undefined' || typeof masks === 'undefined') {
                    console.warn('new Parser(): omit a node from configuration because it misses "type" or "masks"');
                    return null;
                }

                isCaseSensitive = typeof isCaseSensitive === 'undefined'
                    ? globalIsCaseSensitive
                    : !!isCaseSensitive;
                masks = (Array.isArray(masks) ? masks : [ masks ])
                    .filter(mask => mask && (mask.constructor === RegExp) || (typeof mask === 'string'))
                    .map(mask => typeof mask === 'string' && isCaseSensitive ? mask.toLowerCase() : mask);
                if (!masks.length) {
                    console.warn(`new Parser(): omit a node "${type}" from configuration because it has invalid "masks"`);
                    return null;
                }

                interpret = typeof interpret === 'function' ? interpret : c => c;
                return { type, masks, isCaseSensitive, priority, interpret };
            })
            .filter(node => !!node);
    }

    /**
     *
     * @param {String|Buffer} input
     * @return {Object[]}
     */
    parse(input = '') {
        const isBuffer = input && input.constructor === Buffer;
        const parsed = [];

        let i = -1;
        let recognizedText = '';
        // let lineNo = 1;
        // let charNo = 1;
        while (++i < input.length) {
            let char = input[i];
            if (!recognizedText && this.whitespace.test(char)) {
                continue;
            }

            // try to parse as much as possible
            let matchingType;
            let maybeNewType;
            do {
                char = input[i];
                const newText = recognizedText + char;
                maybeNewType = this.nodes.find(({ masks, isCaseSensitive }) => matchAnyMask(newText, masks, isCaseSensitive));
                if (maybeNewType) {
                    matchingType = maybeNewType;
                    recognizedText = newText;
                    i++;
                } else if (matchingType) {
                    i--; // tried swallowing too much; revert to last successful position
                }
            } while (maybeNewType);

            if (!matchingType) {
                handleError(this.ignoreErrors, { char, i, input }); // this might throw an error
                continue;
            }

            const node = new Node(matchingType.type, recognizedText, matchingType.interpret);
            parsed.push(node);
            recognizedText = '';
        }

        return parsed;
    }
}

module.exports = Parser;
