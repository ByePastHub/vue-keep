/* eslint-disable eqeqeq */
var fs = require('fs');
var path = require('path');

// // 移动目录
// const startFileDirectory = path.resolve(__dirname, '../dist');
// // 放置目录
// const endFileDirectory = path.resolve(__dirname, '../../../docs/src/.vuepress/public/example');

rmDirFile(path.resolve(__dirname, '../assets'))
rmDirFile(path.resolve(__dirname, '../images'))
rmDirFile(path.resolve(__dirname, '../guide'))
rmDirFile(path.resolve(__dirname, '../zh'))
rmDirFile(path.resolve(__dirname, '../404.html'))
rmDirFile(path.resolve(__dirname, '../index.html'))
rmDirFile(path.resolve(__dirname, '../manifest.webmanifest'))
rmDirFile(path.resolve(__dirname, '../browserconfig.xml'))
rmDirFile(path.resolve(__dirname, '../favicon.ico'))
rmDirFile(path.resolve(__dirname, '../example/assets'))
rmDirFile(path.resolve(__dirname, '../example/images'))
rmDirFile(path.resolve(__dirname, '../example/favicon.ico'))
rmDirFile(path.resolve(__dirname, '../example/index.html'))

let clear
// 删除
function rmDirFile(directoryPath, callback) {
  const fs = require('fs').promises;
  async function rmdirAsync(directoryPath) {
    try {
      let stat = await fs.stat(directoryPath)
      if (stat.isFile()) {
        await fs.unlink(directoryPath)
      } else {
        let dirs = await fs.readdir(directoryPath)
        // 递归删除文件夹内容(文件/文件夹)
        dirs = dirs.map(dir => rmdirAsync(path.join(directoryPath, dir)))
        await Promise.all(dirs)
        await fs.rmdir(directoryPath)
      }
    } catch (e) {
      console.error(e);
    }
  }
  require('fs').existsSync(directoryPath) && rmdirAsync(directoryPath).then(() => {
    // 确保文件/文件夹均已删除 => 回调
    callback && callback();
    clearInterval(clear)
    clear = setInterval(() => {
      console.log('开始复制文件')
      copyFile(path.resolve(__dirname, '../docs/src/.vuepress/dist'), path.resolve(__dirname, '../'), ['example'])
      copyFile(path.resolve(__dirname, '../docs/src/.vuepress/dist/example'), path.resolve(__dirname, '../example'))
      clearInterval(clear)
    }, 1000)

  })
}

function copyFile(srcPath, tarPath, filter = []) {
  fs.readdir(srcPath, function (err, files) {
    if (err === null) {
      files.forEach(function (filename) {
        let filedir = path.join(srcPath,filename);
        let filterFlag = filter.some(item => item === filename)
        if (!filterFlag) {
          fs.stat(filedir, function (errs, stats) {
            let isFile = stats.isFile()
            if (isFile) { // 复制文件
              const destPath = path.join(tarPath,filename);
              fs.copyFile(filedir, destPath, (err) =>  { })
            } else { // 创建文件夹
              let tarFiledir = path.join(tarPath,filename);
              fs.mkdir(tarFiledir,(err) =>  { });
              copyFile(filedir, tarFiledir, filter)
            }
          })
        }
      })
    } else {
      if (err) console.error(err);
    }
  })
}

// // 复制文件
// function copyFile(srcPath, tarPath, cb) {
//   var rs = fs.createReadStream(srcPath);
//   rs.on('error', function (err) {
//     if (err) {
//       console.log('read error', srcPath);
//     }
//     cb && cb(err);
//   });

//   var ws = fs.createWriteStream(tarPath);
//   ws.on('error', function (err) {
//     if (err) {
//       console.log('write error', tarPath);
//     }
//     console.log('cb', cb)
//     cb && cb(err);
//   });

//   ws.on('close', function (ex) {
//     cb && cb(ex);
//   });

//   rs.pipe(ws);
// }

// // 复制文件夹所有
// function copyDir(srcDir, tarDir, cb) {
//   if (fs.existsSync(tarDir)) {
//     fs.readdir(srcDir, function (err, files) {
//       var count = 0;
//       var checkEnd = function () {
//         ++count == files.length && cb && cb();
//       };

//       if (err) {
//         checkEnd();
//         return;
//       }

//       files.forEach(function (file) {
//         var srcPath = path.join(srcDir, file);
//         var tarPath = path.join(tarDir, file);

//         fs.stat(srcPath, function (_err, stats) {
//           if (stats.isDirectory()) {
//             fs.mkdir(tarPath, function (err) {
//               if (err) {
//                 console.log(err);
//                 return;
//               }

//               copyDir(srcPath, tarPath, checkEnd);
//             });
//           } else {
//             copyFile(srcPath, tarPath, checkEnd);
//           }
//         });
//       });

//       // 为空时直接回调
//       files.length === 0 && cb && cb();
//     });

//   } else {
//     fs.mkdir(tarDir, function (err) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       console.log('创建文件夹', tarDir);
//       copyDir(srcDir, tarDir, cb);
//     });
//   }

// }
