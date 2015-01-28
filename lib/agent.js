var async = require('async'),
request = require('request'),
_ = require('underscore'),
stats = require('./stats'),
notifications = require('./notifications'),
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
    console.log('POSTing to');
    console.log(url);
    console.log(JSON.stringify(all));
    
    request({
      method : 'POST',
      url : url,
      json : all,
      headers : {
        // TODO - at present supercore won't auth with just this
        'X-FH-AUTH-APP' : process.env.FH_APP_API_KEY
      }
    }, function(error, response, body){
      if (error){
        console.log(error);
        return cb(error);
      }
      return cb(null, body);
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
