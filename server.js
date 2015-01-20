var http = require('http'),
logs = require('./lib/logs');

http.createServer(function (req, res) {
  logs(function(err, logResult){
    if (err){
      res.writeHead(500, {'Content-Type': 'text/plain'});
      return res.end('error');    
    }
  });
  res.writeHead(200, {'Content-Type': 'application/json'});
  return res.end(JSON.stringify(logResult));
}).listen(process.env.OPENSHIFT_FEEDHENRY_PORT, process.env.OPENSHIFT_FEEDHENRY_IP);
