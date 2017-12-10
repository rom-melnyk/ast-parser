const assert = require('assert');
const Parser = require('../src/parser');
const { TYPES, NodesConfig } = require('../src/nodes-config');


const { Number, Operators } = TYPES;
const EXPECTED = {
    NumsAndAdd: {
        input: '1+22+33304+4',
        types: [ Number, Operators.Add, Number, Operators.Add, Number, Operators.Add, Number ],
        contents: [ '1', '+', '22', '+', '33304', '+', '4' ]
    },
    WithWhitespace: {
        input: ' 1 +22  + 37 \n  + \n\n444 ',
        types: [ Number, Operators.Add, Number, Operators.Add, Number, Operators.Add, Number ],
        contents: [ '1', '+', '22', '+', '37', '+', '444' ]
    },
    NumsAndAddSubMulDiv: {
        input: '10 + 22 - 33 * 4 / 5',
        types: [ Number, Operators.Add, Number, Operators.Subtract, Number, Operators.Multiply, Number, Operators.Divide, Number ],
        contents: [ '10', '+', '22', '-', '33', '*', '4', '/', '5' ]
    },
    NumsAndAddSubMulDivLetters: {
        input: '10 plus 22 minus 33 mul 4 div 5 x 3',
        types: [ Number, Operators.Add, Number, Operators.Subtract, Number, Operators.Multiply, Number, Operators.Divide, Number, Operators.Multiply, Number ],
        contents: [ '10', 'plus', '22', 'minus', '33', 'mul', '4', 'div', '5', 'x', '3' ]
    },
    NumsAndCaseInsensitiveLetters: {
        input: '10 pLUs 22 MiNUS 33 mul 4 DIV 5 X 3',
        types: [ Number, Operators.Add, Number, Operators.Subtract, Number, Operators.Multiply, Number, Operators.Divide, Number, Operators.Multiply, Number ],
        contents: [ '10', 'pLUs', '22', 'MiNUS', '33', 'mul', '4', 'DIV', '5', 'X', '3' ]
    },
};


describe('parse()', () => {
    const parser = new Parser({ nodes: NodesConfig });

    it('should return an Array', () => {
        assert.ok(Array.isArray( parser.parse() ));
    });

    Object.keys(EXPECTED).forEach((key) => {
        const expected = EXPECTED[key];
        const { types, contents } = expected;
        assert.equal(types.length, contents.length, `Bad EXPECTED.${key} designed: types and contents have different length`);

        it(`should parse ${key}: "${expected.input.replace(/\n/g, '\\n')}"`, () => {
            const parsed = parser.parse(expected.input);
            assert.equal(parsed.length, types.length);
            parsed.forEach(({ type, content }, i) => {
                assert.equal(type, types[i], `Type mismatch @${i}`);
                assert.equal(content, contents[i], `Content mismatch @${i}`);
            });
        });
    });
});
