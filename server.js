var express = require('express'),
logs = require('./lib/logs'),
app = express();

app.get('/sys/reporter/logs', function (req, res) {
  logs(function(err, logResult){
    if (err){
      return res.status(500).json(err);
    }
    return res.json(logResult);
  });
  
});

app.get('/sys/reporter/ping', function(req, res){
  return res.json({ok : true});
});

app.listen(process.env.OPENSHIFT_FEEDHENRY_PORT, process.env.OPENSHIFT_FEEDHENRY_IP);
