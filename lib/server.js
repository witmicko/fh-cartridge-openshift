var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('ok');
}).listen(process.env.OPENSHIFT_FEEDHENRY_PORT, process.env.OPENSHIFT_FEEDHENRY_IP);
