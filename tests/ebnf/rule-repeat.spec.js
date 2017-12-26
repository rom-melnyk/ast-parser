const assert = require('assert');
const RuleRepeat = require('../../src/ebnf/rule-repeat');


describe('RuleRepeat', () => {
    it('should be a constructor', () => {
        assert.equal(typeof RuleRepeat, 'function');
    });

    it('should parse two numbers', () => {
        assert.deepEqual(new RuleRepeat([1, 5]), { from: 1, to: 5 });
    });

    it('should normalize negative numbers', () => {
        assert.deepEqual(new RuleRepeat([-1, -5]), { from: 0, to: 1 });
        assert.deepEqual(new RuleRepeat([1, -5]), { from: 1, to: 1 });
        assert.deepEqual(new RuleRepeat([-1, 5]), { from: 0, to: 5 });
    });

    it('should parse non-numbers and absent values in array notation', () => {
        assert.deepEqual(new RuleRepeat([{}, 5]), { from: 0, to: 5 }, 'new RuleRepeat([{}, 5])');
        assert.deepEqual(new RuleRepeat(['asdf', 5]), { from: 0, to: 5 }, 'new RuleRepeat(["asdf", 5])');
        assert.deepEqual(new RuleRepeat([1]), { from: 1, to: 1 }, 'new RuleRepeat([1])');
    });
    it('should parse "new RuleRepeat()")', () => {
        assert.deepEqual(new RuleRepeat(), { from: 0, to: 1 }, 'new RuleRepeat()');
        // assert.deepEqual(new RuleRepeat(1), { from: 0, to: 1 }, 'new RuleRepeat(1)');
        assert.deepEqual(new RuleRepeat('asdf'), { from: 0, to: 1 }, 'new RuleRepeat("asdf")');
    });

    it('should parse [ {number}, "more" ]', () => {
        assert.deepEqual(new RuleRepeat([ 5, 'more' ]), { from: 5, to: Number.POSITIVE_INFINITY });
    });
    // it('should parse [ "more" ] as [ 0, "more" ]', () => {
    //     assert.deepEqual(new RuleRepeat([ 'more' ]), { from: 0, to: Number.POSITIVE_INFINITY });
    // });
});
