var express = require('express'),
routes = require('./routes/index'),
app = express();

app.use('/sys/reporter/reports', routes.reports);
app.get('/sys/reporter/logs', routes.logs);
app.get('/sys/reporter/ping', function(req, res){
  return res.json({ok : true});
});

app.listen(process.env.OPENSHIFT_FEEDHENRY_REPORTER_PORT, process.env.OPENSHIFT_FEEDHENRY_REPORTER_IP);
