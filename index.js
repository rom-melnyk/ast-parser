const Parser = require('./src/parser');
const { NodesConfig } = require('./src/nodes-config');


const options = { nodes: NodesConfig, ignoreErrors: false };
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
    const errMode = options.ignoreErrors ? 'warning about' : 'throwing';
    console.log(`Parsing: ${ errMode } errors`);

    const parser = new Parser(options);
    console.log(parser.parse(input));
} else {
    console.log(`
usage: node index.js [-i] STRING

  -i        ignore errors (contrary to throwing 'em, the default way)
  STRING    string to parse
`);
}

process.exit(0);
