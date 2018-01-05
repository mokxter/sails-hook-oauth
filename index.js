module.exports = function (sails) {
  return {
    __configKey__: {
      oauth: {
        tokeLife: 3600
      },
    },

    initialize: function (cb) {
      return cb();
    },

    configure: function () {
      sails.config.http = {
        middleware: {
          passportInit: require('passport').initialize(),
          passportSession: require('passport').session(),
          fooBar: (function (req, res, next) {
            return function (req, res, next) {
              console.log('Received HTTP request: ' + req.method + ' ' + req.path);
              return next();
            };
          })(),

          order: [
            'cookieParser',
            'session',
            'passportInit',
            'passportSession',
            'fooBar',
            'bodyParser',
            'compress',
            'poweredBy',
            'router',
            'www',
            'favicon',
          ],
        }
      }
    },

    routes: {
      before: {
        // 'get /oauth/clients': function (req, res, next) {
        //   // { policy: 'sessionAuth' },
        //   // { action: 'client/findall' }
        //   return next();
        // },

        // 'get /oauth/clients/:id': function (req, res, next) {
        //   // { action: 'client/find' }
        //   return next();
        // },

        // 'post /oauth/clients': function (req, res, next) {
        //   // { policy: 'basicAuthenticate' },
        //   // { action: 'client/create' }
        //   return next();
        // },

        // 'get /oauth/authorize': function (req, res, next) {
        //   // { policy: 'ensureLoggedIn' },
        //   // { policy: 'oauthAuthorize' },
        //   // { policy: 'oauthTrustClient' },
        //   // { policy: 'oauthDecision' },
        //   // { policy: 'oauthErrorHandler' },
        //   return next();
        // },

        // 'post /oauth/authorize/decision': function (req, res, next) {
        //   // { policy: 'ensureLoggedIn' },
        //   // { policy: 'oauthDecision' }
        //   return next();
        // },

        // 'post /oauth/token': function (req, res, next) {
        //   // { policy: 'isTrustedClient' },
        //   // { policy: 'passportBasicAuthenticate' },
        //   // { policy: 'oauthToken' },
        //   // { policy: 'oauthErrorHandler' },

        //   return res.json({hello: 'world'});
        // },
      }
    }
  }
};
