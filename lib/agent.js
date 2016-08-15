var async = require('async'),
request = require('request'),
_ = require('underscore'),
os = require('os'),
util = require('util'),
stats = require('./stats'),
notifications = require('./notifications'),
packageJson = require('../package.json'),
logger = require('./logger'),
reports = require('./reports'),
reportingInterval = process.env.FH_REPORTING_INTERVAL || 10000;

module.exports = function(config){
  reportingInterval = config.reportingInterval;
  return function(cb){
    retrieve(function(err, all){
      if (err){
        logger.error(err);
        return cb(err);
      }
      
      if (_.isEmpty(all.stats) && _.isEmpty(all.notifications) && _.isEmpty(all.reports)){
        return cb(null, { ok : true });
      }
      
      // Send a report to supercore
      var url = 'http://' + process.env.FH_MILLICORE,
      start = new Date().getTime();
      url += '/api/v2/mbaas/' + process.env.FH_DOMAIN;
      url += '/' + process.env.FH_ENV + '/apps/';
      url += process.env.FH_INSTANCE + '/report';
      
      logger.debug('POSTing to ' + url, all.stats.length, all.notifications.length, all.reports.length);
      
      request({
        method : 'POST',
        url : url,
        json : all,
        timeout : reportingInterval - 1000,
        headers : {
          'X-FH-AUTH-APP' : process.env.FH_APP_API_KEY,
          'User-Agent' : 'FH-Cartridge-OpenShift/' + packageJson.version + '/' + os.platform() + '/' + os.release()
        }
      }, function(error, response, body){
        if (error || response.statusCode < 200 || response.statusCode > 299 ){
          var end = new Date().getTime() - start,
          err = error || 'Non-2xx status code from Supercore: ' + response.statusCode + util.inspect(body);
          async.each(all.stats, stats.create, function(){});
          async.each(all.notifications, notifications.create, function(){});
          async.each(all.reports, reports.create, function(){});
          logger.debug('POST to supercore failed, took ' + end);
          return cb(err);
        }
        logger.debug('POST to supercore succeeded, took ' + end);
        return cb(null, body);
      });
    });  
  }
}


function retrieve(cb){
  return async.parallel({
    stats : stats.list,
    notifications : notifications.list,
    reports : reports.list
  }, cb);
}
