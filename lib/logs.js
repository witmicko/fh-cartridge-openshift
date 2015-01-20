var fs = require('fs'),
async = require('async'),
path = require('path'),
_ = require('underscore');

module.exports = function(cb){
  var logFilesDirectory = process.env.OPENSHIFT_LOG_DIR || process.env.FH_LOG_DIR;
  if (!logFilesDirectory){
    return cb({error : 'Could not find log directory - expected environment variable'});
  }
  fs.readdir(logFilesDirectory, function(err, files){
    if (err){
      return cb(err);
    }
    var parallelGetters = {};
    files.forEach(function(file){
      if (file.match(/\.log$/)){
        parallelGetters[file] = function(asyncCb){
          return fs.readFile(path.join(logFilesDirectory, file), function(err, fileRes){
            if (err){
              return asyncCb(err);
            }
            return asyncCb(null, fileRes.toString());
          });
        };
      }
    });
    
    return async.parallel(parallelGetters, cb);
  });  
}
