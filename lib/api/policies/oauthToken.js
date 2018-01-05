var Oauth = require('../services/Oauth.js');

module.exports = function(req, res, next) {
  return Oauth.token()(req, res, next);
};
