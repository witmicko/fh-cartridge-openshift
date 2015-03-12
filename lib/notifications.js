var fs = require('fs'),
path = require('path'),
_ = require('underscore'),
logger = require('./logger'),
notifications = [];


exports.list = function(cb){
  cb(null, notifications);
  notifications = [];
}

exports.create = function(notification, cb){
  notifications.push(notification);
  return cb(null, { ok : true });  
}

/*
  Checks to see if the node.js gear starts successfully over a period of 
  maxRetries * 2 seconds, in 2 second intervals.
 */
exports.checkStarted = function(){
  var retries = 0,
  maxRetries = 10,
  interval = setInterval(function(){
    retries++;
    
    if (retries >= maxRetries){
      clearInterval(interval);
      logger.info('Node.js cartridge start failed');
      notifications.push({ type : "DYNOMAN_APP_START_FAILED" });
      return;
    }
    
    var pidFile = path.join(process.env.OPENSHIFT_NODEJS_PID_DIR, 'cartridge.pid'),
    pid;
    fs.readFile(pidFile, function(err, fileContents){
      if (err || _.isEmpty(fileContents)){
        // Not yet started - try again in a while
        return;
      }  
      pid = parseInt(fileContents.toString(), 10);
      if (isNaN(pid)){
        // Something gone wrong - retry in a bit.
        return;
      }
      // We've successfully started
      logger.info('Node.js cartridge start detected');
      clearInterval(interval);
      notifications.push({ type : "DYNOMAN_APP_START_SUCCEEDED" });
    
    });
  }, 2000);
}

/*
  We have no way of verifying the node cart will/wont stop, as our process
  is killed prior. Assume it stops OK, likely outcome. 
  Then, flushing of events on cart stop will push this event
 */
exports.checkStopped = function(){
  notifications.push({ type : "DYNOMAN_APP_STOP_SUCCEEDED" });
}
