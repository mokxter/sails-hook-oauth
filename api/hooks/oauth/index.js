let oauthHook = sails.hooks.oauth;

import _ from 'lodash';
import Marlinspike from 'marlinspike';

if (!oauthHook) {
  class Oauth extends Marlinspike {
    constructor(sails) {
      super(sails, module);
    }

    // configure() {
    //   sails.services.passport.loadStrategies();
    // }
  }

  oauthHook = Marlinspike.createSailsHook(Oauth);
}

export default oauthHook;
