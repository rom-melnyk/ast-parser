const DecimalNumber = require('./nodes/decimal-number');
const OperatorAdd = require('./nodes/operator-add');
const OperatorSubtract = require('./nodes/operator-subtract');
const OperatorMultiply = require('./nodes/operator-multiply');
const OperatorDivide = require('./nodes/operator-divide');


const WHITESPACE = /\s|\n/;
// const NEW_LINE = /\n/;
const KNOWN_NODE_TYPES = [ DecimalNumber, OperatorAdd, OperatorSubtract, OperatorMultiply, OperatorDivide ];

const SURROUNDING_LENGTH = 10; // when exposing an error, how many chars around to show


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
 * @param {Boolean} [ignoreErrors=false]    error handling strategy: throw (default) or warn-and-ignore
 * @return {Array}
 */
function parse(input = '', { ignoreErrors = false } = {}) {
    const isBuffer = input && input.constructor === Buffer;
    const parsed = [];

    let i = -1;
    let recognizedText = '';
    // let lineNo = 1;
    // let charNo = 1;
    while (++i < input.length) {
        let char = input[i];
        if (!recognizedText && WHITESPACE.test(char)) {
            continue;
        }

        // try to parse as much as possible
        let MatchingConstructor;
        let MaybeNewConstructor;
        do {
            char = input[i];
            const newText = recognizedText + char;
            MaybeNewConstructor = KNOWN_NODE_TYPES.find(ctor => ctor.match(newText));
            if (MaybeNewConstructor) {
                MatchingConstructor = MaybeNewConstructor;
                recognizedText = newText;
                i++;
            } else if (MatchingConstructor) {
                i--; // tried swallowing too much; revert to last successful position
            }
        } while (MaybeNewConstructor);

        if (!MatchingConstructor) {
            handleError(ignoreErrors, { char, i, input }); // this might throw an error
            continue;
        }

        const node = new MatchingConstructor(recognizedText);
        parsed.push(node);
        recognizedText = '';
    }

    return parsed;
}


function buildTree(nodes) {
    return {};
}

module.exports = { parse, buildTree };
