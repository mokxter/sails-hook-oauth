var Oauth = require('../services/Oauth.js');

/* global Client */

module.exports = function(req, res, next) {
  return Oauth.authorize(
    function (clientId, redirectURI, done) {
      Client.findOne({ client_id: clientId }, function (err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }
        if (client.redirect_uri !== redirectURI) { return done(null, false); }
        return done(null, client, client.redirect_uri);
      });
    }
  )(req, res, next);
};
