require('esc-exit')();
require('process').on('unhandledRejection', console.error.bind(console));
const myVersions = JSON.parse(require('fs').readFileSync('my-versions.json', 'utf8'));

const renderer = new (require('./cli-renderer'))(myVersions);
const nagger = new (require('./nagger'))(myVersions, renderer);

nagger.start();