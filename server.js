var express = require('express'),
routes = require('./routes/index'),
app = express(),
dgram = require('dgram'),
auth = require('./lib/auth'),
reportingAgent = require('./lib/agent'),
udpserver = dgram.createSocket('udp4'),
logger = require('./lib/logger'),
reportingInterval = process.env.FH_REPORTING_INTERVAL || 10000;

if (typeof reportingInterval === 'string'){
  reportingInterval = parseInt(reportingInterval);
}

// Internal routes only
app.use('/sys/admin/reports', routes.reports);
app.get('/sys/admin/ping', routes.ping);
app.get('/sys/admin/stats', routes.stats.list);
app.use('/sys/admin/notifications', routes.notifications);
udpserver.on('message', routes.stats.create);

// Authenticated & external routes
app.use(auth);
app.use('/sys/reporter/logs', routes.logs);
app.use('/sys/reporter/resources', routes.resources);

// Bind the TCP and UDP listeners
app.listen(process.env.OPENSHIFT_FEEDHENRY_REPORTER_PORT, process.env.OPENSHIFT_FEEDHENRY_REPORTER_IP);
udpserver.bind(process.env.OPENSHIFT_FEEDHENRY_REPORTER_PORT, process.env.OPENSHIFT_FEEDHENRY_REPORTER_IP);

udpserver.on('listening', function () {
  var a = udpserver.address();
  logger.info('FeedHenry Reporter listening for UDP datagrams on ' + a.address + ":" + a.port);
});

// Send data back to supercore periodically
setInterval(function(){
  reportingAgent(function(err){
    if (err){
      return logger.error('Error logging back to core platform', err);      
    }
    logger.debug('Report sent OK - waiting ' + reportingInterval)
  });
}, reportingInterval);

process.on('SIGTERM', function(){
  // try once to flush before quitting
  reportingAgent(function(err){
    if (err){
      return logger.error('Failed to flush reports - exiting anyway');
    }
    logger.info('Successfully flushed reports - exiting');
  });
});
