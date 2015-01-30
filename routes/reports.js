var reports = require('../lib/reports');
var express = require('express');
var reportsRoute = new express.Router();
var bodyParser = require('body-parser');
var cors = require('cors');
reportsRoute.use(cors());
reportsRoute.use(bodyParser());
reportsRoute.get('/', listReports);
reportsRoute.post('/', createReport);
reportsRoute.post('/:topic', createReport);

function listReports(req, res){
  reports.list(function(err, reportingResult){
    if (err || !reportingResult){
      return res.status(500).json(err || 'No reports found');
    }
    return res.json(reportingResult);
  });
}

function createReport(req, res){
  var report = req.body;
  
  report.topic = req.params.topic;
  reports.create(report, function(err, createResult){
    if (err){
      return res.status(500).json(err);
    }
    
    return res.json(createResult);
  });
}

module.exports = reportsRoute;
