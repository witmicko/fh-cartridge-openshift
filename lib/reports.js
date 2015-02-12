var fs = require('fs'),
reports = [];

exports.list = function(cb){
  cb(null, reports);
  reports = [];
}

exports.create = function(report, cb){
  reports.push(report);
  return cb(null, { ok : true });
}
