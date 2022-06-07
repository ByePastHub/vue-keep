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
  copyDir(startFileDirectory, endFileDirectory, () => {
    console.log('全部复制完成');
  });
});

// 删除
function rmDirFile(path, cb) {
  let files = [];
  if (fs.existsSync(path)) {
    var count = 0;
    var checkEnd = function() {
      ++count == files.length && cb && cb();
    };
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        console.log('遇到文件夹', curPath);
        rmDirFile(curPath, checkEnd);
      } else {
        fs.unlinkSync(curPath);
        checkEnd();
      }
    });
    // 如果删除文件夹为放置文件夹根目录  不执行删除
    if (path == endFileDirectory) {
      // console.log('删除文件夹完成', path);
    } else {
      fs.rmdirSync(path);
    }
    // 为空时直接回调
    files.length === 0 && cb && cb();
  } else {
    cb && cb();
  }
}

// 复制文件
function copyFile(srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on('error', function(err) {
    if (err) {
      console.log('read error', srcPath);
    }
    cb && cb(err);
  });

  var ws = fs.createWriteStream(tarPath);
  ws.on('error', function(err) {
    if (err) {
      console.log('write error', tarPath);
    }
    cb && cb(err);
  });

  ws.on('close', function(ex) {
    cb && cb(ex);
  });

  rs.pipe(ws);
}

// 复制文件夹所有
function copyDir(srcDir, tarDir, cb) {
  if (fs.existsSync(tarDir)) {
    fs.readdir(srcDir, function(err, files) {
      var count = 0;
      var checkEnd = function() {
        ++count == files.length && cb && cb();
      };

      if (err) {
        checkEnd();
        return;
      }

      files.forEach(function(file) {
        var srcPath = path.join(srcDir, file);
        var tarPath = path.join(tarDir, file);

        fs.stat(srcPath, function(_err, stats) {
          if (stats.isDirectory()) {
            fs.mkdir(tarPath, function(err) {
              if (err) {
                console.log(err);
                return;
              }

              copyDir(srcPath, tarPath, checkEnd);
            });
          } else {
            copyFile(srcPath, tarPath, checkEnd);
          }
        });
      });

      // 为空时直接回调
      files.length === 0 && cb && cb();
    });

  } else {
    fs.mkdir(tarDir, function(err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('创建文件夹', tarDir);
      copyDir(srcDir, tarDir, cb);
    });
  }
}
