function _matchString(input, mask) {
    if (typeof input !== 'string') {
        return false;
    }


}


/**
 * @param {String|Array<Object>} input
 * @param {Array<String|RegExp|Object>} rule
 * @return {boolean|Object}                 `false` if no match, `true` if partial match, Node is full match
 */
function match(input, rule) {
    let match = false;
    let i = -1;

    // while (++i < rule.length) {
    //     const defining = rule[i];
    //     if (defining.constructor === String) {
    //         if ()
    //     } else if (defining.constructor === RegExp) {
    //
    //         if (defining.exec(input))
    //     } else if (defining.constructor === Object) {
    //         if ()
    //     }
    // }

    return match;
}


module.exports = { match };
