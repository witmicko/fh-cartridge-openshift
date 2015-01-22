var fs = require('fs');

module.exports = function(cb){
  var messagingBackupFile = process.env.FH_MESSAGING_BACKUP_FILE;
  if (!messagingBackupFile){
    return cb({error : 'Could not find log directory - expected environment variable'});
  }
  fs.readFile(messagingBackupFile, function(err, file){
    if (err){
      return cb(err);
    }
    return cb(null, file.toString());
  });  
}
