const DecimalNumber = require('./nodes/decimal-number');
const OperatorAdd = require('./nodes/operator-add');


const WHITESPACE = /\s|\n/;
const KNOWN_NODE_TYPES = [ DecimalNumber, OperatorAdd ];

function parse(string = '') {
    const parsed = [];

    for (let i = 0; i < string.length; i++) {
        const char = string[i];
        let node = parsed[ parsed.length - 1 ]; // last one
        if (node) {
            const tryAppendText = node.content + char;
            if (node.constructor.mask.test(tryAppendText)) { // it's safe to append char to node
                node.content = tryAppendText;
                continue;
            }
        }

        if (WHITESPACE.test(char)) {
            continue;
        }

        const Ctor = KNOWN_NODE_TYPES.find(ctor => ctor.mask.test(char));

        if (!Ctor) {
            throw new SyntaxError(`Unrecognizable char "${char}" at ${i}`);
        }
        node = new Ctor(char);
        parsed.push(node);
    }

    // console.log(parsed);
    return parsed;
}


function buildTree(nodes) {
    return {};
}

module.exports = { parse, buildTree };
