const fs = require('fs');

require('esc-exit')();
require('process').on('unhandledRejection', console.error.bind(console));

const myVersions = JSON.parse(fs.readFileSync('my-versions.json', 'utf8'));

const cliRenderer = new (require('./cli-renderer'))(myVersions);

const versionProviders = {
  npm: require('./npm-version-provider'),
  node: require('./node-version-provider')
};

async function checkVersions() {
  const versions = await Promise.all(
    Object.entries(myVersions).map(([name, {tag = 'latest', provider = 'npm'}]) =>
                                      versionProviders[provider]({name, tag}))
  );
  cliRenderer.update(versions);
}

cliRenderer.init();
checkVersions();

setInterval(
  checkVersions,
  1000 * 60 * 5 // check every 5 minutes
);