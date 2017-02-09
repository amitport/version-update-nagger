const versionProviders = {
  npm: require('./npm-version-provider'),
  node: require('./node-version-provider')
};

class Nagger {
  constructor({myVersions, renderer}) {
    this.renderer = renderer;

    this.untriggeredVersionRequests = Object.entries(myVersions).map(([name, {
                                                                        version,
                                                                        tag = 'latest',
                                                                        provider = 'npm'}]) => {
      const versionProvider = versionProviders[provider];
      const untriggeredLatestVersionRequest = versionProvider.bind(versionProvider, {name, tag});
      return async () => {
        return {
          name,
          myVersion: version,
          latestVersion: await untriggeredLatestVersionRequest()
        };
      };
    });
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
    this.renderer.update(await Promise.all(this.untriggeredVersionRequests.map(_ => _())));
  }
}

module.exports = Nagger;