const fs = require('fs');
const process = require('process');
const Nagger = require('./nagger');
const CliRenderer = require('./cli-renderer');

const nagger = new Nagger({
  myVersions: JSON.parse(fs.readFileSync('my-versions.json', 'utf8')),
  renderer: new CliRenderer()
});

nagger.start();

// make sure uncaught exception are at least logged properly
process.on('unhandledRejection', console.error.bind(console));