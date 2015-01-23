var notifications = require('../lib/notifications');
var express = require('express');
var notificationsRoute = new express.Router();
var bodyParser = require('body-parser');
var cors = require('cors');
notificationsRoute.use(cors());
notificationsRoute.use(bodyParser());
notificationsRoute.get('/', function(req, res){
  notifications.list(function(err, notificationsResult){
    if (err || !notificationsResult){
      return res.status(500).json(err || 'No notifications found');
    }
    return res.json(notificationsResult);
  });
});

notificationsRoute.post('/', function(req, res){
  var notification = req.body;
  notifications.create(notification, function(err, createResult){
    if (err){
      return res.status(500).json(err);
    }
    
    return res.json(createResult);
  });
});

module.exports = notificationsRoute;
