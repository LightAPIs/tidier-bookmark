// 打包 crx 文件的脚本
const fs = require('fs');
const path = require('path');
const manifest = require('../dist/manifest.json');
const packageInfo = require('../package.json');
const ChromeExtension = require('crx');

const crxName = `${packageInfo.name}_v${manifest.version}.crx`;
const crx = new ChromeExtension({
  privateKey: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
});

crx
  .load(path.resolve(__dirname, '../dist'))
  .then(crx => crx.pack())
  .then(crxBuffer => {
    fs.writeFile(crxName, crxBuffer, err => {
      err ? console.error(err) : console.log(`>>>>>>>  ${crxName}  <<<<<<< 已打包完成`);
    });
  })
  .catch(err => {
    console.log(err);
  });
