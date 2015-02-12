var assert = require('assert'),
auth = require('../lib/auth.js'),
apikey = '1a2b';
process.env.FH_APP_API_KEY = apikey;

exports.it_should_allow_matching_api_keys = function(finish){
  var req = {
    headers : {
      'x-fh-app-api-key' : apikey
    }
  };
  auth(req, {}, finish);
}

exports.it_should_refuse_wrong_api_keys = function(finish){
  var req = {
    headers : {
      'x-fh-app-api-key' : 'wrong'
    }
  };
  auth(req, {
    status : function(){
      return this;
    },
    json : function(error){
      assert.ok(error);
      finish();
    }
  });
}
