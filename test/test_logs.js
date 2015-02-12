var assert = require('assert'),
path = require('path'),
proxyquire = require('proxyquire'),
_ = require('underscore'),
logs = require('../lib/logs.js');

process.env.FH_LOG_DIR = '/var/log/'; // Should return some data on any *nix system

exports.it_should_list_logs = function(finish){  
  logs.list(function(err, loglist){
    assert.ok(!err);
    assert.ok(loglist.length > 1);
    finish();
  });  
};

exports.it_should_get_a_log = function(finish){
  logs.list(function(err, loglist){
    var log = _.first(loglist);
    logs.getFile(log.name, function(err, logContent){
      assert.ok(!err);
      assert.ok(logContent.status === 'ok');
      finish();
    });
  })
};


exports.it_should_remove_a_log_file = function(finish){
  var mockLogFilePath = path.join(process.env.FH_LOG_DIR, 'deletemetest.log'),
  mockLogs = proxyquire('../lib/logs.js', {
    fs : { 
      unlink : function(path, cb){
        assert.ok(path === mockLogFilePath, 'Error -path ' + path + 'should match ' + mockLogFilePath);
        return cb();
      }
    }
  });
  mockLogs.deleteFile('deletemetest.log', function(err){
    assert.ok(!err, err);
    finish();
  });
};
