const passport = require('passport');

// There's no async implemention of passport
// One option is to convert or wrap it in a promise
// then implement it in an async await code.
module.exports = async function (req, res) {
  passport.authenticate(
    'local',
    (err, user) => {
      if((err) || (!user)) {
        return res.redirect('/login');
      }

      req.login(
        user,
        err => {
          if (err) {
            return res.redirect('/login');
          }
          return res.redirect('/home');
        }
      );
    }
  )(req, res);
};
