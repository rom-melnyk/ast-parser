const Node = require('./node');


const NEW_LINE = /\n/;


/**
 * Decides if given text matches any of given masks.
 * @param {string} text
 * @param {Array<{isCaseSensitive: boolean, masks: Array<string|RegExp>}>} nodes
 * @return {boolean|Object}         `false` if nothing matched, `true` for partial match, `node` for full match
 */
function matchAnyNode(text, nodes) {
    let n = -1;
    let matched = false;

    while (++n < nodes.length) {
        const node = nodes[n];
        const { isCaseSensitive, masks } = node;
        const preparedText = isCaseSensitive ? text : text.toLowerCase();

        let m = -1;
        while (++m < masks.length) {
            const mask = masks[m];
            if (mask.constructor === RegExp) {
                const match = mask.exec(preparedText);
                if (match) {
                    if (match[0] === preparedText) {
                        return node;
                    } else {
                        matched = true;
                    }
                }
            } else if (mask === preparedText) { // typeof mask === 'string'
                return node;
            } else if (mask.length > preparedText.length && mask.substr(0, preparedText.length) === preparedText) {
                matched = true;
            }
        }
    }

    return matched;
}


function getCharAt(input, i, isBuffer) {
    return input[ i ];
    // TODO make me handling Buffer
}


function maybeHandleNewLine(char, charNo, lineNo) {
    if (NEW_LINE.test(char)) {
        charNo = 1;
        lineNo++;
    } else {
        charNo++;
    }
    return { charNo, lineNo };
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
            // TODO remove nodes with duplicate types
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
        let lineNo = 1;
        let charNo = 1;

        while (++i < input.length) {
            let char = getCharAt(input, i, isBuffer);

            // ignore whitespace between nodes
            if (this.whitespace.test(char)) {
                ({ charNo, lineNo } = maybeHandleNewLine(char, charNo, lineNo));
                continue;
            }

            // try to parse as much as possible
            const found = { node: null, text: '', i: -1, charNo, lineNo };
            let maybeNewMatch;
            let text = '';
            do {
                char = getCharAt(input, i, isBuffer);
                text += char;
                maybeNewMatch = matchAnyNode(text, this.nodes);

                if (typeof maybeNewMatch === 'object') { // full matching node found
                    Object.assign(found, { node: maybeNewMatch, text, i, charNo, lineNo });
                }

                ({ charNo, lineNo } = maybeHandleNewLine(char, charNo, lineNo));

                if (maybeNewMatch /* node || true */) {
                    i++;
                } else if (!maybeNewMatch && found.node) {
                    // tried swallowing too much; revert to last successful position
                    ({ text, i, charNo, lineNo } = found);
                }
            } while (maybeNewMatch);

            if (!found.node) {
                const error = new SyntaxError(`Error parsing text "${text}" at ${found.lineNo}:${found.charNo}`);
                if (this.ignoreErrors) {
                    parsed.errors = parsed.errors || [];
                    parsed.errors.push(error);
                    continue;
                } else {
                    throw error;
                }
            }

            const node = new Node(found.node.type, found.text, found.node.interpret);
            parsed.push(node);
        }

        return parsed;
    }
}

module.exports = Parser;
