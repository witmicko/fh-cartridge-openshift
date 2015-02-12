var async = require('async'),
request = require('request'),
_ = require('underscore'),
os = require('os'),
util = require('util'),
stats = require('./stats'),
notifications = require('./notifications'),
packageJson = require('../package.json'),
reports = require('./reports');

module.exports = function(cb){
  retrieve(function(err, all){
    if (err){
      return console.log(err);
    }
    
    if (_.isEmpty(all.stats) && _.isEmpty(all.notifications) && _.isEmpty(all.reports)){
      return cb(null, { ok : true });
    }
    
    // Send a report to supercore
    var url = 'https://' + process.env.FH_MILLICORE;
    url += '/api/v2/mbaas/' + process.env.FH_DOMAIN;
    url += '/' + process.env.FH_ENV + '/apps/';
    url += process.env.FH_INSTANCE + '/report';
    
    // Debug logging to assist testing this
    // TODO Add a proper logger in here
    console.log('POSTing to');
    console.log(url);
    console.log(JSON.stringify(all));
    
    request({
      method : 'POST',
      url : url,
      json : all,
      headers : {
        // TODO - at present supercore won't auth with just this
        'X-FH-AUTH-APP' : process.env.FH_APP_API_KEY,
        'User-Agent' : 'FH-Cartridge-OpenShift/' + packageJson.version + '/' + os.platform() + '/' + os.release()
      }
    }, function(error, response, body){
      if (error || response.statusCode !== 200){
        var err = error || 'Non-2xx status code from Supercore: ' + response.statusCode + util.inspect(body);
        console.log(err);
        return cb(err);
      }
      // TODO - This will flush subsequent stats/notifications between the POST and the response. 
      // MAJOR DERP
      flush(function(){
        return cb(null, body);
      })
    });
  });  
}


function retrieve(cb){
  return async.parallel({
    stats : stats.list,
    notifications : notifications.list,
    reports : reports.list
  }, cb);
}

function flush(cb){
  return async.parallel({
    stats : stats.flush,
    notifications : notifications.flush,
    reports : reports.flush
  }, cb);
}
