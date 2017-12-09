const assert = require('assert');
const { parse } = require('../src/parse');
const { TYPES } = require('../src/nodes/abstract-node');


const EXPECTED = {
    NumsAndAdd: {
        input: '1+2+3+4',
        types: [ TYPES.Number, TYPES.Operators.Add, TYPES.Number, TYPES.Operators.Add, TYPES.Number, TYPES.Operators.Add, TYPES.Number ],
        contents: [ '1', '+', '2', '+', '3', '+', '4' ]
    },
    WithWhitespace: {
        input: ' 1 +2  + 3 \n  + \n\n4 ',
        types: [ TYPES.Number, TYPES.Operators.Add, TYPES.Number, TYPES.Operators.Add, TYPES.Number, TYPES.Operators.Add, TYPES.Number ],
        contents: [ '1', '+', '2', '+', '3', '+', '4' ]
    },
};

const MODES = [ true, false ]; // greedy, ascetic

describe('parse()', () => {
    it('should return an Array', () => {
        assert.ok(Array.isArray( parse() ));
    });

    Object.keys(EXPECTED).forEach((key) => {
        MODES.forEach((mode) => {
            const expected = EXPECTED[key];
            const { types, contents } = expected;
            assert.equal(types.length, contents.length, `Bad EXPECTED.${key} designed: types and contents have different length`);

            it(`should parse "${expected.input.replace(/\n/g, '\\n')}" in ${ mode ? 'greedy' : 'ascetic' } mode`, () => {
                const parsed = parse(expected.input, { greedy: mode });
                assert.equal(parsed.length, types.length);
                parsed.forEach(({ type, content }, i) => {
                    assert.equal(type, types[i], `Type mismatch @${i}`);
                    assert.equal(content, contents[i], `Content mismatch @${i}`);
                });
            });
        });
    });
});
