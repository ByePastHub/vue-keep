/* eslint-disable eqeqeq */
var fs = require('fs');
var path = require('path');

// 移动目录
const startFileDirectory = path.resolve(__dirname, '../dist');
// 放置目录
const endFileDirectory = path.resolve(__dirname, '../../../docs/src/.vuepress/public/example');

// 删除复制执行
rmDirFile(endFileDirectory, () => {
  console.log('开始复制');
});
copyFile(startFileDirectory, endFileDirectory, () => {
  console.log('全部复制完成');
});

// 删除
// function rmDirFile(path, cb) {
//   let files = [];
//   if (fs.existsSync(path)) {
//     var count = 0;
//     var checkEnd = function() {
//       ++count == files.length && cb && cb();
//     };
//     files = fs.readdirSync(path);
//     files.forEach(function(file, index) {
//       const curPath = path + '/' + file;
//       if (fs.statSync(curPath).isDirectory()) {
//         console.log('遇到文件夹', curPath);
//         rmDirFile(curPath, checkEnd);
//       } else {
//         fs.unlinkSync(curPath);
//         checkEnd();
//       }
//     });
//     // 如果删除文件夹为放置文件夹根目录  不执行删除
//     if (path == endFileDirectory) {
//       // console.log('删除文件夹完成', path);
//     } else {
//       fs.rmdirSync(path);
//     }
//     // 为空时直接回调
//     files.length === 0 && cb && cb();
//   } else {
//     cb && cb();
//   }
// }
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
  fs.existsSync(directoryPath) && rmdirAsync(directoryPath).then(() => {
    // 确保文件/文件夹均已删除 => 回调
    callback && callback();
  });
}

function copyFile(srcPath, tarPath, filter = []) {
  fs.access(tarPath, err => {
    !err && fs.mkdir(tarPath, { recursive: true }, err => {
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
              fs.copyFile(filedir, destPath, err => console.log('err', err));
            } else { // 创建文件夹
              const tarFiledir = path.join(tarPath, filename);
              fs.mkdir(tarFiledir, err => console.log('err', err));
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
