'use strict';
const fs = require('fs');
const path = require('path');
const qiniu = require('qiniu');

const argv1 = process.argv.splice(2);
const accessKey = (argv1.filter(e => e.includes('--accessKey='))[0] || '').split('--accessKey=')[1];
const secretKey = (argv1.filter(e => e.includes('--secretKey='))[0] || '').split('--secretKey=')[1];
const bucket = (argv1.filter(e => e.includes('--bucket='))[0] || '').split('--bucket=')[1];
if (!(accessKey && secretKey && bucket)) throw new Error('参数缺省');

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const prefix = fs.readFileSync(path.resolve(__dirname, './src/config/prefix'), 'utf-8');
console.log(`prefix: ${prefix}`);

//自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
const options = {
  scope: bucket,
  expires: 7200,
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;

const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

const _filesAll = [];

/**
 * 遍历目录返回结构
 * @param targetPath
 * @returns {{path: *, dirsData: [], files: []}}
 */
function readDir(targetPath) {
  const filesAll = fs.readdirSync(targetPath);
  const dirs = [];
  const files = [];
  let dirsData = [];
  filesAll.filter(file => {
    const status = fs.statSync(path.join(targetPath, file));
    status.isDirectory() ? dirs.push(file) : files.push(file);
  });
  dirsData = dirs.map(dir => readDir(path.join(targetPath, dir)));
  const key = targetPath.replace(/.*dist/, prefix).replace(/\\/g, '/');
  files.forEach(e => {
    _filesAll.push({
      path: path.join(targetPath, e),
      key: `${key}/${e}`,
    });
  });
  return {
    path: targetPath,
    key,
    files,
    dirsData,
  };
}

// 文件上传
const putFile = function (key, localFile) {
  return new Promise((resolve, reject) => {
    let again = true;
    const push = function () {
      formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          // 失败1秒后重试一次
          if (again) {
            again = false;
            setTimeout(() => {
              push();
            }, 1000);
          } else {
            reject(respErr);
            throw respErr;
          }
        }
        if (respInfo.statusCode === 200) {
          console.log(`${localFile} 上传成功`);
          console.log(respBody);
          resolve(respBody);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
          reject(respInfo.statusCode, respBody);
        }
      });
    };
    push();
  });
};

(async function () {
  try {
    await readDir(path.resolve(__dirname, './dist'));
    console.log('upload-qiniu-cdn-start!!!');
    const putFilePromiseAll = [];
    for (let i = 0; i < _filesAll.length; i++) {
      putFilePromiseAll.push(putFile(_filesAll[i].key, _filesAll[i].path));
    }
    Promise.all(putFilePromiseAll)
      .then(() => {
        console.log('upload-qiniu-cdn-done!!!');
      })
      .catch(err => {
        throw err;
      });
  } catch (e) {
    throw e;
  }
})();
