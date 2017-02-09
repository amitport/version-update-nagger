const fs = require('fs');
const request = require('request-promise-native');
const clui = require('clui');
const clc = require('cli-color');
require('esc-exit')();
require('process').on('unhandledRejection', console.error.bind(console));

const storedVersions = JSON.parse(fs.readFileSync('my-versions.json', 'utf8'));
const name2myVersion = storedVersions.reduce((res, {name, myVersion}) => {
  res[name] = myVersion;
  return res;
}, {});

new clui.Line()
  .padding(1)
  .column('name', 20, [clc.blue])
  .column('version', 20, [clc.blue])
  .output();

function printVersions(versions) {
  const lineBuffer = new clui.LineBuffer({
    x: 0,
    y: 1,
    width: 'console',
    height: 'console'
  });

  versions.forEach(({name, version}) => {
    new clui.Line(lineBuffer)
      .padding(1)
      .column(name, 20, [clc.cyan])
      .column(version, 20, [name2myVersion[name] !== version ? clc.green : clc.magenta])
      .store();
  });

  new clui.Line(lineBuffer).fill().store(); // blankLine

  new clui.Line(lineBuffer)
    .padding(1)
    .column(`last update — ${new Date().toLocaleString()}`, 40, [clc.yellow])
    .fill()
    .store();

  new clui.Line(lineBuffer).fill().store(); // blankLine

  new clui.Line(lineBuffer)
    .padding(1)
    .column('press ESC to close', 40)
    .fill()
    .store();

  lineBuffer.output();
}

async function npmVersionGetter({name, tag}) {
  const packageInfo = await request(`https://registry.npmjs.org/${name}`, {json: true});
  return {
    name,
    version: packageInfo.versions[packageInfo['dist-tags'][tag]].version
  };
}

storedVersions.find(_ => _.name === 'node').versionGetter = async function nodeVersionGetter() {
  return {
    name: 'node',
    version: (await request('https://nodejs.org/download/release/index.json', {json: true}))[0].version.substring(1)
  };
};

async function checkVersions() {
  const versions = await Promise.all(
    storedVersions.map(({name, tag = 'latest', versionGetter = npmVersionGetter}) => versionGetter({name, tag}))
  );
  printVersions(versions);
}

checkVersions();
setInterval(
  checkVersions,
  1000 * 60 * 5 // check every 5 minutes
);