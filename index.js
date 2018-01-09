// var Oauth = require('/lib/oauth.js');
var Passport = require('passport').constructor;

module.exports = function (sails) {
  return {
    initialize: function (cb) {
      sails.config.oauth = { tokenLife: 3600 };

      sails.after('hook:orm:loaded', function () {
        // Get reference of the user model.
        var UserModel = sails.models['user'];

        // Create instance of passport and bind it to sails.
        sails.passport = new Passport();
        // Teach our Passport how to serialize/dehydrate a user object into an id
        sails.passport.serializeUser(function(user, done) {
          console.log('Using primary key', UserModel.primaryKey, 'with record:',user);
          done(null, user[UserModel.primaryKey]);
        });

        // Teach our Passport how to deserialize/hydrate an id back into a user object
        sails.passport.deserializeUser(function(id, done) {
          UserModel.findOne(id, function(err, user) {
            done(err, user);
          });
        });
        return cb();
      });

    },

    configure: function () {
    },

    routes: {
      before: {
        '/*': function configurePassport(req, res, next) {
          sails.passport.initialize()(req, res, function(err) {
            if (err) return res.negotiate(err);
            sails.passport.session()(req, res, function(err) {
              if (err) return res.negotiate(err);
              next();
            });
          });
        }
      }
    }
  }
};
