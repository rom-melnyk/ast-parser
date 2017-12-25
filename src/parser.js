const { prepareNodesFromConfig, getWhitespaceNode, getNotRecognizedNode, createNode } = require('./nodes/node-factory');


const NEW_LINE = /\n/;


/**
 * Decides if given text matches any of given masks.
 * @param {string} text
 * @param {Array<{isCaseSensitive: boolean, masks: Array<string|RegExp>}>} nodes
 * @return {boolean|Object}         `false` if nothing matched, `true` for partial match, node for full match
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


function adjustCursor(line, column, char) {
    if (NEW_LINE.test(char)) {
        column = 1;
        line++;
    } else {
        column++;
    }
    return { line, column };
}


class Parser {
    /**
     * @param {boolean} [isCaseSensitive=false]
     * @param {boolean} [ignoreErrors=false]
     * @param {RegExp} [whitespace=/\s+/]           whitespace mask; it is ignored unless treated specifically on parent node level
     * @param {Array<Object>} nodes                 nodes configuration
     */
    constructor({ isCaseSensitive = false, ignoreErrors = false, whitespace, nodes = [] } = {}) {
        let globalIsCaseSensitive = isCaseSensitive;
        /** @tested-in tests/parser-module.js */
        this.isCaseSensitive = isCaseSensitive;
        this.ignoreErrors = ignoreErrors;

        this.whitespaceNode = getWhitespaceNode(whitespace);
        this.notRecognizedNode = getNotRecognizedNode();

        this.nodes = prepareNodesFromConfig(nodes, globalIsCaseSensitive);
        this.nodes.push( this.whitespaceNode );

        this.nodesByClassId = this.nodes.reduce((acc, node) => {
            acc[node.classId] = node;
            return acc;
        }, {});
    }


    /**
     * @param {String|Buffer} input
     * @return {Array<Object<classId {String}, content>>}
     */
    parse(input = '') {
        const isBuffer = input && input.constructor === Buffer;
        const parsed = [];

        let i = -1;
        let line = 1;
        let column = 1;

        while (++i < input.length) {
            let char = getCharAt(input, i, isBuffer);
            let text = '';
            const found = { node: null, text, i, line, column };
            let maybeNewMatch;

            // try to parse as much as possible
            do {
                char = getCharAt(input, i, isBuffer);
                text += char;
                maybeNewMatch = matchAnyNode(text, this.nodes);

                if (maybeNewMatch) { // full or partial matching found
                    Object.assign(
                        found,
                        { node: maybeNewMatch, text, i, line, column },
                        found.node ? null : { position: { line, column, absolute: i } }
                    );
                }

                ({ line, column } = adjustCursor(line, column, char));

                if (maybeNewMatch) { // full or partial matching found
                    i++;
                } else if (found.node) {
                    // tried swallowing too much; revert to last successful position
                    ({ text, i, line, column } = found);
                }
            } while (maybeNewMatch);


            if (found.node === true) { // recognition was successful but then unexpected char appeared
                found.node = this.notRecognizedNode;
            } else if (!found.node) { // failed to recognize even first char
                const previousNode = parsed[ parsed.length - 1 ];
                if (previousNode && previousNode.classId === this.notRecognizedNode.classId) {
                    previousNode.content += char;
                    continue;
                } else {
                    found.node = this.notRecognizedNode;
                }
            }

            parsed.push({
                classId: found.node.classId,
                content: text,
                position: found.position
            });
        }

        return parsed;
    }


    complile(nodes = []) {
        let root;
        let current;

        while (nodes.length) {
            const { classId, content } = nodes.shift();
            const node = createNode(content, this.nodesByClassId[classId]);
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
                    if (node.isChildValid(current)) {
                        node.addChild(current);
                        root = node;
                        current = node;
                        continue;
                    }
                    throw new EvalError('Compilation finished unexpectedly: an expression cannot be added as a child to a node');
                }
                throw new EvalError('Compilation finished unexpectedly: finished expression followed by terminal leaf');
            } else {
                if (current.isChildValid(node)) {
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
