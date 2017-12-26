const MORE = 'more';


class RuleRepeat {
    constructor([ from, to ] = []) {
        from = +from;
        from = from > 0 ? from : 0;

        to = to === MORE ? Number.POSITIVE_INFINITY : +to;
        to = to > 0 ? to : 0;
        to = to >= from
            ? (to === 0 ? 1 : to)
            : from;

        this.from = from;
        this.to = to;
    }
}


module.exports = RuleRepeat;
