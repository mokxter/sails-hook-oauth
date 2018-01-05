var Oauth = require('../services/Oauth.js');

// module.exports = Oauth.errorHandler;

module.exports = function (err, req, res, next) {
  return Oauth.errorHandler()(err, req, res, next);
};
