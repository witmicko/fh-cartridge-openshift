var stats = [];

exports.create = function(stat, cb){
  stats.push(stat);
  return cb(null, {ok : true});
}

exports.list = function(cb){
  cb(null, stats);
  stats = [];
}
