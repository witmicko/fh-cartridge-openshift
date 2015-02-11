module.exports = function(req, res, next){
  var appApiKey = 'x-fh-app-api-key'
  if (!req.headers[appApiKey]){
    return res.status(401).json({ error : 'No API key found' })
  }
  
  if (req.headers[appApiKey] !== process.env.FH_APP_API_KEY){
    return res.status(401).json({ error : 'Invalid API Key' })
  }
  return next();
}
