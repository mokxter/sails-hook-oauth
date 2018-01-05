/* global Client */

module.exports = {
  friendlyName: 'Create new client',

  description: '',

  inputs: {
    name: {
      description: 'Friend name for the client',
      type: 'string',
      required: true
    },
    redirectURI: {
      description: '',
      type: 'string',
      required: true
    },
    trusted: {
      description: '',
      type: 'string',
      required: false
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    inputs.trusted = !!inputs.trusted;
    inputs = _.mapKeys(inputs, (value, key) => { return _.snakeCase(key); });
    var client = await Client.create(inputs).fetch();
    return exits.success(client);
  }
};