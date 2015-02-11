var fhResourceUsage = require('fh-resource-usage');
var express = require('express');
var resourcesRoute = new express.Router();
var bodyParser = require('body-parser');
var cors = require('cors');
resourcesRoute.use(cors());
resourcesRoute.use(bodyParser());
resourcesRoute.get('/', function(req, res){
  fhResourceUsage({}, function(err, resourceResult){
    if (err || !resourceResult){
      return res.status(500).json(err || 'No resource information found');
    }
    return res.json(resourceResult);
  });
});

module.exports = resourcesRoute
