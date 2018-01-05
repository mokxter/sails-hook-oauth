const login = require('connect-ensure-login');

// module.exports = login.ensureLoggedIn;
module.exports = function (req, res, next) {
  return login.ensureLoggedIn()(req, res, next);
};
