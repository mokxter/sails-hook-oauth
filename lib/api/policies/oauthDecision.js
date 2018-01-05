var Oauth = require('../services/Oauth.js');
var series = require('middleware-flow').series;

module.exports = function (req, res, next) {
  return series(...Oauth.decision())(req, res, next);
};
