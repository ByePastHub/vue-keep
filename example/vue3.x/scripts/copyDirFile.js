/* eslint-disable eqeqeq */
var fs = require('fs');
var path = require('path');

// 移动目录
const startFileDirectory = path.resolve(__dirname, '../dist');
// 放置目录
const endFileDirectory = path.resolve(__dirname, '../../../docs/src/.vuepress/public/example');

// 删除复制执行
rmDirFile(endFileDirectory, () => {
  console.log('开始复制...');
  copyFile(startFileDirectory, endFileDirectory, []);
  console.log('复制完成');
});

function rmDirFile(directoryPath, callback) {
  async function rmdirAsync(directoryPath) {
    try {
      const stat = await fs.promises.stat(directoryPath);
      if (stat.isFile()) {
        await fs.promises.unlink(directoryPath);
      } else {
        let dirs = await fs.promises.readdir(directoryPath);
        // 递归删除文件夹内容(文件/文件夹)
        dirs = dirs.map(dir => rmdirAsync(path.join(directoryPath, dir)));
        await Promise.all(dirs);
        await fs.promises.rmdir(directoryPath);
      }
    } catch (e) {
      console.error(e);
    }
  }
  if (!fs.existsSync(directoryPath)) {
    callback && callback();
  } else {
    rmdirAsync(directoryPath).then(() => {
      // 确保文件/文件夹均已删除 => 回调
      callback && callback();
    });
  }
}

function copyFile(srcPath, tarPath, filter = []) {
  fs.access(tarPath, err => {
    err && fs.mkdir(tarPath, { recursive: true }, err => {
      if (err) throw err;
    });
  });
  fs.readdir(srcPath, function(err, files) {
    if (err === null) {
      files.forEach(function(filename) {
        const filedir = path.join(srcPath, filename);
        const filterFlag = filter.some && filter.some(item => item === filename);
        if (!filterFlag) {
          fs.stat(filedir, function(errs, stats) {
            const isFile = stats.isFile();
            if (isFile) { // 复制文件
              const destPath = path.join(tarPath, filename);
              fs.copyFile(filedir, destPath, err => err && console.log('err', err));
            } else { // 创建文件夹
              const tarFiledir = path.join(tarPath, filename);
              fs.mkdir(tarFiledir, err => err && console.log('err', err));
              copyFile(filedir, tarFiledir, filter);
            }
          });
        }
      });
    } else {
      if (err) console.error(err);
    }
  });
}
