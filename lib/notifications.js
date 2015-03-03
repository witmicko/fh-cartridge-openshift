var notifications = [];

exports.list = function(cb){
  cb(null, notifications);
  notifications = [];
}

exports.create = function(notification, cb){
  notifications.push(notification);
  return cb(null, { ok : true });  
}
