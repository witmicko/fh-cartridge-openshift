var express = require('express'),
routes = require('./routes/index'),
app = express(),
dgram = require('dgram'),
udpserver = dgram.createSocket('udp4');

app.use('/sys/reporter/reports', routes.reports);
app.get('/sys/reporter/logs', routes.logs);
app.get('/sys/reporter/ping', routes.ping);
app.get('/sys/reporter/stats', routes.stats.list);
udpserver.on('message', routes.stats.create);

// Bind the TCP and UDP listeners
app.listen(process.env.OPENSHIFT_FEEDHENRY_REPORTER_PORT, process.env.OPENSHIFT_FEEDHENRY_REPORTER_IP);
udpserver.bind(process.env.OPENSHIFT_FEEDHENRY_REPORTER_PORT, process.env.OPENSHIFT_FEEDHENRY_REPORTER_IP);

udpserver.on('listening', function () {
  var a = udpserver.address();
  console.log('FeedHenry Reporter listening for UDP datagrams on ' + a.address + ":" + a.port);
});
