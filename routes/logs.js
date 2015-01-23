var logs = require('../lib/logs');

module.exports = function (req, res) {
  logs(function(err, logResult){
    if (err){
      return res.status(500).json(err);
    }
    return res.json(logResult);
  });
  
}
