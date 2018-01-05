module.exports = async function (req, res) {
  req.logout();
  res.redirect('/login');
};
