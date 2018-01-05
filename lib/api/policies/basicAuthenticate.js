var passport = require('passport');

module.exports = function (req, res, next) {
  return passport.authenticate(
    'basic',
    { session: false }
  )(req, res, next);
};
