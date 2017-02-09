const clui = require('clui');
const clc = require('cli-color');

class CliRenderer {
  constructor(myVersions) {
    this.myVersions = myVersions;
  }

  init() {
    new clui.Line()
      .padding(1)
      .column('name', 20, [clc.blue])
      .column('version', 20, [clc.blue])
      .output();
  }

  update(versions) {
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
        .column(version, 20, [this.myVersions[name].version !== version ? clc.green : clc.magenta])
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
}

module.exports = CliRenderer;