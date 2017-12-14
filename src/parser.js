const { prepareNodeFromConfig, createNode } = require('./nodes/node-factory');


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
            .map((node) => prepareNodeFromConfig(node, globalIsCaseSensitive))
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

            const node = createNode(found.node, found.text);
            parsed.push(node);
        }

        return parsed;
    }


    complile(nodes = []) {
        let root;
        let current;

        while (nodes.length) {
            const node = nodes.shift();
            if (!root) {
                root = node;
                current = node;
                continue;
            }

            while (current !== root && current.isClosed()) {
                current = current.parent;
            }

            if (current.isClosed()) {
                if (node.children) {
                    if (node.isChildAllowed(current)) {
                        root = node;
                        node.addChild(current);
                        current = node;
                        continue;
                    }
                    throw new EvalError('Compilation finished unexpectedly: an expression cannot be added as a child to a node');
                }
                throw new EvalError('Compilation finished unexpectedly: finished expression followed by terminal leaf');
            } else {
                if (current.isChildAllowed(node)) {
                    current.addChild(node);
                    continue;
                }
                throw new EvalError('Compilation finished unexpectedly: cannot add a node to existing structure');
            }
        }

        return root;
    }
}

module.exports = Parser;
