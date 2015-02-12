var winston = require('winston'),
logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)({ level: process.env.FH_LOGLEVEL || 'info' })]
});
module.exports = logger;
