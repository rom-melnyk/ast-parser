const { parse } = require('./src/parse');

const options = { greedy: true, ignoreErrors: false };
let input = '';

// parse arguments
process.argv.slice(2).forEach((arg, idx, args) => {
    switch (true) {
        case arg === '-i':
            options.ignoreErrors = true;
            return;
        case idx === args.length - 1:
            input = arg;
    }
});

if (input) {
    const parsingMode = options.greedy ? 'greedy' : 'ascetic';
    const errMode = options.ignoreErrors ? 'warning about' : 'throwing';
    console.log(`Parsing in ${ parsingMode } mode; ${ errMode } errors`);
    console.log(parse(input, options));
} else {
    console.log(`
usage: node index.js [-i] STRING

  -i        ignore errors (contrary to throwing 'em, the default way)
  STRING    string to parse
`);
}

process.exit(0);
