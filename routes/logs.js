var logs = require('../lib/logs');
var express = require('express');
var logsRoute = new express.Router();
var bodyParser = require('body-parser');
var cors = require('cors');
logsRoute.use(cors());
logsRoute.use(bodyParser());
logsRoute.get('/', function(req, res){
  logs.list(function(err, logsList){
    if (err || !logsList){
      return res.status(500).json(err || 'No log files found');
    }
    return res.json({ logs : logsList, status : 'ok' });
  });
});

logsRoute.get('/:filename', function(req, res){
  logs.getFile(req.params.filename, function(err, file){
    if (err || !file){
      return res.status(500).json(err || 'No log file found for filename ' + req.params.filename);
    }
    return res.json(file);
  });
});

module.exports = logsRoute
