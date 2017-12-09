const DecimalNumber = require('./nodes/decimal-number');
const OperatorAdd = require('./nodes/operator-add');
const OperatorSubtract = require('./nodes/operator-subtract');
const OperatorMultiply = require('./nodes/operator-multiply');
const OperatorDivide = require('./nodes/operator-divide');


const WHITESPACE = /\s|\n/;
const KNOWN_NODE_TYPES = [ DecimalNumber, OperatorAdd, OperatorSubtract, OperatorMultiply, OperatorDivide ];

const SURROUNDING_LENGTH = 10; // when exposing an error, how many chars around to show


function parseGreedy(input, i, recognizedText) {
    let newCtor;
    let Ctor;
    do {
        const char = input[i];
        const newText = recognizedText + char;
        newCtor = KNOWN_NODE_TYPES.find(ctor => ctor.mask.test(newText));
        if (newCtor) {
            Ctor = newCtor;
            recognizedText = newText;
            i++;
        } else if (Ctor) {
            i--; // tried swallowing too much; go back by one char
        }
    } while (newCtor);

    return { i, recognizedText, Ctor };
}


function canAddCharToNode(char, node) {
    // try to append a char to existing node...
    if (node) {
        const newContent = node.content + char;
        return node.constructor.mask.test(newContent);
    }

    return false;
}


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
 *
 * @param {String|Buffer} input
 * @param {Boolean} [greedy=true]           if yes, try to swallow as much chars as possible before creating a node.
 *                                          Otherwise creates a node ance first matching symbol found (strict language rules)
 * @param {Boolean} [ignoreErrors=false]    error handling strategy: throw (default) or warn-and-ignore
 * @return {Array}
 */
function parse(input = '', { greedy = true, ignoreErrors = false } = {}) {
    const isBuffer = input && input.constructor === Buffer;
    const parsed = [];

    let i = -1;
    let recognizedText = '';
    while (++i < input.length) {
        let Ctor;
        const char = input[i];
        if (!recognizedText && WHITESPACE.test(char)) {
            continue;
        }

        if (greedy) {
            // try to parse as much as possible
            ({ i, recognizedText, Ctor } = parseGreedy(input, i, recognizedText));
        } else {
            const node = parsed[ parsed.length - 1 ];
            if (canAddCharToNode(char, node)) {
                node.content += char;
                continue;
            } else {
                Ctor = KNOWN_NODE_TYPES.find(ctor => ctor.mask.test(char));
            }
        }

        if (!Ctor) {
            handleError(ignoreErrors, { char, i, input }); // this might throw an error
            continue;
        }

        const node = new Ctor(greedy ? recognizedText : char);
        parsed.push(node);
        recognizedText = '';
    }

    return parsed;
}


function buildTree(nodes) {
    return {};
}

module.exports = { parse, buildTree };
