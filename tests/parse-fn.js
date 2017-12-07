const assert = require('assert');
const { parse } = require('../src/index');
const { TYPES } = require('../src/nodes/abstract-node');


describe('parse()', () => {
    it('should return an Array', () => {
        assert.ok(Array.isArray( parse() ));
    });

    const NUMS_AND_ADD = '1+2+3+4';
    it(`should parse "${NUMS_AND_ADD}"`, () => {
        const parsed = parse(NUMS_AND_ADD);
        assert.ok(parsed.length, 7);
        assert.ok(parsed[0].type, TYPES.Number);
        assert.ok(parsed[1].type, TYPES.Operators.Add);
        assert.ok(parsed[2].type, TYPES.Number);
        assert.ok(parsed[3].type, TYPES.Operators.Add);
        assert.ok(parsed[4].type, TYPES.Number);
        assert.ok(parsed[5].type, TYPES.Operators.Add);
        assert.ok(parsed[6].type, TYPES.Number);
    });

    const WITH_WHITESPACE = ' 1 +2  + 3 \n  + \n\n4 ';
    it(`should ignore whitespaces in "${WITH_WHITESPACE}"`, () => {
        const parsed = parse(WITH_WHITESPACE);
        assert.ok(parsed.length, 7);
        assert.ok(parsed[0].type, TYPES.Number);
        assert.ok(parsed[1].type, TYPES.Operators.Add);
        assert.ok(parsed[2].type, TYPES.Number);
        assert.ok(parsed[3].type, TYPES.Operators.Add);
        assert.ok(parsed[4].type, TYPES.Number);
        assert.ok(parsed[5].type, TYPES.Operators.Add);
        assert.ok(parsed[6].type, TYPES.Number);
    });

});
