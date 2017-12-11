const assert = require('assert');
const Parser = require('../src/parser');


const nodes = [
    { type: 'number', masks: /^[0-9]+$/ },
    { type: '+', masks: [ '+', 'plus' ] },
    { type: '-', masks: [ '-', 'minus' ] },
    { type: '*', masks: [ '*', 'mul', 'x' ] },
    { type: '/', masks: [ '/', 'div' ] },
];

const EXPECTED = {
    Nums_Add: {
        input: '1+22+33304+4',
        types: [ 'number', '+', 'number', '+', 'number', '+', 'number' ],
        contents: [ '1', '+', '22', '+', '33304', '+', '4' ]
    },
    With_Whitespace: {
        input: ' 1 +22  + 37 \n  + \n\n444 ',
        types: [ 'number', '+', 'number', '+', 'number', '+', 'number' ],
        contents: [ '1', '+', '22', '+', '37', '+', '444' ]
    },
    Nums_MathSymbols: {
        input: '10 + 22 - 33 * 4 / 5',
        types: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number' ],
        contents: [ '10', '+', '22', '-', '33', '*', '4', '/', '5' ]
    },
    Nums_MathSymbolsByLetters: {
        input: '10 plus 22 minus 33 mul 4 div 5 x 3',
        types: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number', '*', 'number' ],
        contents: [ '10', 'plus', '22', 'minus', '33', 'mul', '4', 'div', '5', 'x', '3' ]
    },
    Nums_MathSymbolsByLetters_CaseSensitive: {
        input: '10 pLUs 22 MiNUS 33 muL 4 DIV 5 X 3',
        types: [ 'number', '+', 'number', '-', 'number', '*', 'number', '/', 'number', '*', 'number' ],
        contents: [ '10', 'pLUs', '22', 'MiNUS', '33', 'muL', '4', 'DIV', '5', 'X', '3' ]
    },
};


describe('parse()', () => {
    const parser = new Parser({ nodes });

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


    it('should respect case sensitivity', () => {
        const parser = new Parser({ nodes, isCaseSensitive: true, ignoreErrors: true });
        const parsed = parser.parse(EXPECTED.Nums_MathSymbolsByLetters_CaseSensitive.input);
        assert.equal(parsed.length, 6, 'parsed.length');
        assert.ok(Array.isArray(parsed.errors), 'parsed.errors[]');
        assert.equal(parsed[1].content, '22');
        assert.equal(parsed[3].content, '4');
        assert.equal(parsed[5].content, '3');
    });
});
