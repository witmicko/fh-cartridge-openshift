var fs = require('fs');

exports.list = function(cb){
  var messagingBackupFile = process.env.FH_MESSAGING_BACKUP_FILE;
  if (!messagingBackupFile){
    return cb({error : 'Could not find reports directory - expected environment variable'});
  }
  fs.readFile(messagingBackupFile, function(err, file){
    if (err){
      return cb(err);
    }
    return cb(null, file.toString());
  });  
}

exports.create = function(report, cb){
  console.log(report);
  return cb(null, { ok : true });
}
