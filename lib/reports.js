var fs = require('fs'),
reports = [];

exports.list = function(cb){
  cb(null, reports);
  return;
}

exports.create = function(report, cb){
  reports.push(report);
  return cb(null, { ok : true });
}

exports.flush = function(cb){
  reports = [];
  return cb();
}
