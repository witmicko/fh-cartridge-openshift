var express = require('express'),
routes = require('./routes/index'),
app = express(),
dgram = require('dgram'),
auth = require('./lib/auth'),
reportingAgent = require('./lib/agent'),
udpserver = dgram.createSocket('udp4');

// Internal routes only
app.use('/sys/admin/reports', routes.reports);
app.get('/sys/admin/ping', routes.ping);
app.get('/sys/admin/stats', routes.stats.list);
app.use('/sys/admin/notifications', routes.notifications);
udpserver.on('message', routes.stats.create);

// Authenticated & external routes
app.use(auth);
app.use('/sys/reporter/logs', routes.logs);

// Bind the TCP and UDP listeners
app.listen(process.env.OPENSHIFT_FEEDHENRY_REPORTER_PORT, process.env.OPENSHIFT_FEEDHENRY_REPORTER_IP);
udpserver.bind(process.env.OPENSHIFT_FEEDHENRY_REPORTER_PORT, process.env.OPENSHIFT_FEEDHENRY_REPORTER_IP);

udpserver.on('listening', function () {
  var a = udpserver.address();
  console.log('FeedHenry Reporter listening for UDP datagrams on ' + a.address + ":" + a.port);
});

// Send data back to supercore periodically
setInterval(function(){
  reportingAgent(function(){});
}, 10000);
