var stats = require('../lib/stats');
/* UDP Datagram route */
exports.create = function (message, remote) {
  stats.create(message, function(err, createRes){
    // UDP is fire & forget - can't return errors here
    if (err){
      console.log('Error creating stat: ' + err);
    }
  });
};


exports.list = function(req, res){
  stats.list(function(err, listRes){
    if (err){
      return res.status(500).json(err);
    }
    return res.json(listRes);
  });
}
