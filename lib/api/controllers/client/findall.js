/* global Client */

module.exports = {
  friendlyName: 'Find all clients of user',

  description: '',

  inputs: {},

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/clients'
    }
  },

  fn: async function (inputs, exits) {
    let clients = await Client.find();
    return exits.success({ clients: clients });
  } 
};