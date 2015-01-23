var reports = require('../lib/reports');
var express = require('express');
var reportsRoute = new express.Router();

reportsRoute.get('/', function(req, res){
  reports.list(function(err, reportingResult){
    if (err){
      return res.status(500).json(err);
    }
    // TODO Return JSON array here instead
    return res.end(reportingResult);
  });
});

reportsRoute.post('/', function(req, res){
  var report = req.body;
  reports.create(report, function(err, createResult){
    if (err){
      return res.status(500).json(err);
    }
    
    return res.end(createResult);
  });
});

module.exports = reportsRoute;
