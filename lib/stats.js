var stats = [];

exports.create = function(stat, cb){
  if (!stat){
    return cb('No statistic provided');
  }
  stats.push(stat.toString());
  return cb(null, { ok : true });  
}

exports.list = function(cb){
  cb(null, stats);
  stats = [];
}
