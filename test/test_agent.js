var assert = require('assert'),
proxyquire = require('proxyquire').noCallThru(),
stats = require('../lib/stats.js'),
requestCalled = false,
agent = proxyquire('../lib/agent.js', {
  './stats' : stats,
  'request' : function(opts, cb){
    requestCalled = true;
    assert.ok(opts.json);
    assert.ok(opts.json.stats.length === 2);
    return cb(null, {statusCode : 200}, { ok : true });
  }
});

exports.it_should_return_instantly_on_no_events = function(finish){
  var d1 = new Date().getTime();
  agent(function(err, result){
    var d2 = new Date().getTime() - d1;
    assert.ok(d2 < 10);
    assert.ok(result.ok === true);
    assert.ok(!requestCalled);
    finish();
  });  
}

exports.it_should_send_some_reports = function(finish){
  stats.create('one', function(){});
  stats.create('two', function(){});
  agent(function(err){
    assert.ok(!err);
    assert.ok(requestCalled);
    stats.list(function(err, statsList){
      assert.ok(statsList.length === 0, 'It should flush the stats queue');
      return finish();
    });
  });
}

exports.it_should_deflush_on_failure = function(finish){
  stats.create('one', function(){});
  stats.create('two', function(){});
  var errAgent = proxyquire('../lib/agent.js', {
    './stats' : stats,
    'request' : function(opts, cb){
      return cb({err : true});
    }
  })
  errAgent(function(err){
    assert.ok(err);
    stats.list(function(err, statsList){
      assert.ok(statsList.length === 2, 'It should re-create stats on failure');
      finish();
    });
  });
}
