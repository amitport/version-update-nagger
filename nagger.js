const versionProviders = {
  npm: require('./npm-version-provider'),
  node: require('./node-version-provider')
};

class Nagger {
  constructor(myVersions, renderer) {
    this.myVersions = myVersions;
    this.renderer = renderer;
  }

  start() {
    this.renderer.init();

    this.checkVersions();

    setInterval(
      this.checkVersions.bind(this),
      1000 * 60 * 5 // check every 5 minutes
    );
  }

  async checkVersions() {
    const versions = await Promise.all(
      Object.entries(this.myVersions).map(([name, {tag = 'latest', provider = 'npm'}]) =>
        versionProviders[provider]({name, tag}))
    );
    this.renderer.update(versions);
  }
}

module.exports = Nagger;