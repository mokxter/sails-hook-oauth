
module.exports = function (req, res, next) {
  if (req.oauth2.client.trusted) {
    req.trusted = true;
    req.body = req.query;
    req.body.transaction_id = req.oauth2.transactionID; // eslint-disable-line camelcase
    return next();
  }

  return res.view('pages/dialog', {
    transactionID: req.oauth2.transactionID,
    user: req.user,
    client: req.oauth2.client,
    jwtToken: req.query.token
  });
};
