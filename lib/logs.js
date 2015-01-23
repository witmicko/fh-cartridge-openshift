var fs = require('fs'),
async = require('async'),
path = require('path'),
_ = require('underscore');

exports.list = function(cb){
  var logFilesDirectory = process.env.OPENSHIFT_LOG_DIR || process.env.FH_LOG_DIR;
  if (!logFilesDirectory){
    return cb({error : 'Could not find log directory - expected environment variable'});
  }
  fs.readdir(logFilesDirectory, function(err, files){
    if (err){
      return cb(err);
    }
    var parallelGetters = [];
    files.forEach(function(file){
      if (file.match(/\.log$/)){
        parallelGetters.push(function(asyncCb){
          return fs.stat(path.join(logFilesDirectory, file), function(err, fileStatRes){
            if (err){
              return asyncCb(err);
            }
            fileStatRes = {
              name : file, 
              modified : fileStatRes.mtime,
              modifiedts : new Date(fileStatRes.mtime).getTime(),
              created : fileStatRes.ctime,
              createdts: new Date(fileStatRes.ctime).getTime(),
              size : fileStatRes.size
            }
            return asyncCb(null, fileStatRes);
          });
        });
      }
    });
    
    return async.parallel(parallelGetters, cb);
  });  
}

exports.getFile = function(logFileName, cb){
  var logFilesDirectory = process.env.OPENSHIFT_LOG_DIR || process.env.FH_LOG_DIR,
  logFile
  if (!logFilesDirectory){
    return cb({error : 'Could not find log directory - expected environment variable'});
  }
  logFile = path.join(logFilesDirectory, logFileName);
  fs.readFile(logFile, function(err, fileContents){
    if (err){
      return cb(err);
    }
    
    fileContents = fileContents.toString();
    
    return cb(null, { status : "ok", msg : { offset : 1, data : fileContents.split('\n') } });
  })
  
}
