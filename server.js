var express = require('express'),
routes = require('./routes/index'),
app = express(),
dgram = require('dgram'),
auth = require('./lib/auth'),
reportingAgent = require('./lib/agent'),
udpserver = dgram.createSocket('udp4');

app.use(auth);
app.use('/sys/reporter/reports', routes.reports);
app.use('/sys/reporter/logs', routes.logs);
app.get('/sys/reporter/ping', routes.ping);
app.get('/sys/reporter/stats', routes.stats.list);
app.use('/sys/reporter/notifications', routes.notifications);
udpserver.on('message', routes.stats.create);

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
