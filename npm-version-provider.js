const request = require('request-promise-native');

module.exports = async function npmVersionProvider({name, tag}) {
  const packageInfo = await request(`https://registry.npmjs.org/${name}`, {json: true});
  return packageInfo.versions[packageInfo['dist-tags'][tag]].version;
};