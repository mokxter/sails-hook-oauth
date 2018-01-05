/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

/* global User Client */

module.exports.bootstrap = async function(done) {

  try {
    // Create a user
    const user = await User.findOne({email: 'me@gmail.com'});
    if (user) {
      console.log('Default user already exists');
      console.log('- username: ' + user.email);
      console.log('- password: password');
    } else {
      const createdUser = await User.create({
        email: 'me@gmail.com',
        password: 'password'
      }).fetch();
      if (createdUser) {
        console.log('Default user created');
        console.log('- username: ' + createdUser.email);
        console.log('- password: password');
      }
    }

    // Create a trusted application
    const trustedClient = await Client.findOne({name: 'trustedTestClient'});
    if (trustedClient) {
      console.log('trustedTestClient already exists');
      console.log('- client_id: ' + trustedClient.client_id);
      console.log('- client_secret: ' + trustedClient.client_secret);
      console.log('- redirectURI: ' + trustedClient.redirect_uri);
    } else {
      const createdTrustedClient = await Client.create({
        name: 'trustedTestClient',
        redirect_uri: 'http://localhost:1338',
        trusted: true
      }).fetch();
      if (createdTrustedClient) {
        console.log('trustedTestClient created');
        console.log('- client_id: ' +     createdTrustedClient.client_id);
        console.log('- client_secret: ' + createdTrustedClient.client_secret);
        console.log('- redirectURI: ' +   createdTrustedClient.redirect_uri);
      }
    }

    // Create a untrusted application
    const untrustedClient = await Client.findOne({name: 'untrustedTestClient'});
    if (untrustedClient) {
      console.log('untrustedTestClient already exists');
      console.log('- client_id: '     + untrustedClient.client_id);
      console.log('- client_secret: ' + untrustedClient.client_secret);
      console.log('- redirectURI: '   + untrustedClient.redirect_uri);
    } else {
      const createdUntrustedClient = await Client.create({
        name: 'untrustedTestClient',
        redirect_uri: 'http://localhost:1339',
        trusted: false
      }).fetch();
      if (createdUntrustedClient) {
        console.log('untrustedTestClient created');
        console.log('- client_id: '     + createdUntrustedClient.client_id);
        console.log('- client_secret: ' + createdUntrustedClient.client_secret);
        console.log('- redirectURI: '   + createdUntrustedClient.redirect_uri);
      }
    }
  } catch (err) {
    console.log(err.message);
  }

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();
};
