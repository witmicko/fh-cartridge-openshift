var stats = require('../lib/stats');
/* UDP Datagram route */
exports.create = function (message, remote) {
  try{
    message = JSON.parse(message);
  }catch(err){
    console.log("Error parsing UDP Datagram: " + err);
    console.log(message);
  }
  
  stats.create(message, function(err, createRes){
    // UDP is fire & forget
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
