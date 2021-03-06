const request = require('request-promise-native');

module.exports = async function nodeVersionProvider() {
  return (await request('https://nodejs.org/download/release/index.json', {json: true}))[0].version.substring(1);
};