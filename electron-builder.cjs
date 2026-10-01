module.exports = {
  appId: 'com.tuempresa.navegadorx',
  productName: 'NavegadorX',
  directories: { output: 'release', buildResources: 'build' },
  files: ['dist/**', 'dist-electron/**', 'package.json'],
  mac: { target: ['dmg','zip'] },
  win: { target: ['nsis'] },
  linux: { target: ['AppImage'] }
};
