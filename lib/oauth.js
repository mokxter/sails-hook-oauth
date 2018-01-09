const oauth2orize         = require('oauth2orize');
const bcrypt              = require('bcrypt');

/* global Client AuthCode AccessToken RefreshToken User sails */

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

server.serializeClient(function(client, done) {
  return done(null, client.id);
});

server.deserializeClient(function(id, done) {
  Client.findOne(id, function(err, client) {
    if (err) { return done(err); }
    return done(null, client);
  });
});


// Generate authorization code
server.grant(oauth2orize.grant.code(async function (client, redirectURI, user, ares, done) {
  try {
    var authCode = await AuthCode.create({
      client_id: client.client_id,
      redirect_uri: redirectURI,
      user_id: user.id,
      scope: ares.scope
    }).fetch();
    if (authCode) {
      return done(null, authCode.code);
    }
  } catch (err) {
    return done(err, null);
  }
}));

// Generate access token for Implicit flow
// Only access token is generated in this flow, no refresh token is issued
server.grant(oauth2orize.grant.token(async function(client, user, ares, done) {
  try {
    await AccessToken.destroy({ user_id: user.id, client_id: client.client_id });
    const accessToken = await AccessToken.create({ user_id: user.id, client_id: client.client_id }).fetch();
    return done(null, accessToken.token);
  } catch (err) {
    return done(err);
  }
}));

// Exchange authorization code for access token
server.exchange(oauth2orize.exchange.code(function (client, code, redirectURI, done) {
  AuthCode.findOne({
    code: code
  }).exec(async function (err, code) {
    if (err || !code) { return done(err); }
    if (client.client_id !== code.client_id) { return done(null, false); }
    if (redirectURI !== code.redirect_uri) { return done(null, false); }

    try {
      await RefreshToken.destroy({ user_id: code.user_id, client_id: code.client_id });
      await AccessToken.destroy({ user_id: code.user_id, client_id: code.client_id });

      var result = await sails.getDatastore().transaction(async (db, proceed) => {
        try {
          var refreshToken = await RefreshToken.create({ user_id: code.user_id, client_id: client.client_id }).fetch().usingConnection(db);
          var accessToken = await AccessToken.create({ user_id: code.user_id, client_id: client.client_id }).fetch().usingConnection(db);
          return proceed(null, { refreshToken: refreshToken.token, accessToken: accessToken.token });
        } catch (err) {
          return proceed(err);
        }
      });

      return done(null, result.accessToken, result.refreshToken, { 'expires_in': sails.config.oauth.tokenLife });
    } catch (err) {
      return done(err);
    }

  });
}));

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
  User.findOne({ email: username }, async function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    var pwdCompare = bcrypt.compareSync(password, user.password);
    if (!pwdCompare) { return done(null, false); }

    // Remove Refresh and Access tokens and create new ones
    try {
      await RefreshToken.destroy({ user_id: user.id, client_id: client.client_id });
      await AccessToken.destroy({ user_id: user.id, client_id: client.client_id });

      var result = await sails.getDatastore().transaction(async (db, proceed) => {
        try {
          var refreshToken = await RefreshToken.create({ user_id: user.id, client_id: client.client_id }).fetch().usingConnection(db);
          var accessToken = await AccessToken.create({ user_id: user.id, client_id: client.client_id }).fetch().usingConnection(db);
          return proceed(null, { refreshToken: refreshToken.token, accessToken: accessToken.token });
        } catch (err) {
          return proceed(err);
        }
      });

      return done(null, result.accessToken, result.refreshToken, { 'expires_in': sails.config.oauth.tokenLife });
    } catch (err) {
      return done(err);
    }
  });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {

  RefreshToken.findOne({ token: refreshToken }, function (err, token) {

    if (err) { return done(err); }
    if (!token) { return done(null, false); }
    if (!token) { return done(null, false); }

    User.findOne({ id: token.user_id }, async function (err, user) {

      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      try {
        await RefreshToken.destroy({ user_id: user.id, client_id: client.client_id });
        await AccessToken.destroy({ user_id: user.id, client_id: client.client_id });

        var result = await sails.getDatastore().transaction(async (db, proceed) => {
          try {
            var refreshToken = await RefreshToken.create({ user_id: user.id, client_id: client.client_id }).fetch().usingConnection(db);
            var accessToken = await AccessToken.create({ user_id: user.id, client_id: client.client_id }).fetch().usingConnection(db);
            return proceed(null, { refreshToken: refreshToken.token, accessToken: accessToken.token });
          } catch (err) {
            return proceed(err);
          }
        });

        return done(null, result.accessToken, result.refreshToken, { 'expires_in': sails.config.oauth.tokenLife });
      } catch (err) {
        return done(err);
      }
    });
  });
}));

exports = module.exports = server;



