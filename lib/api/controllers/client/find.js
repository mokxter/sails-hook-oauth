/* global Client */

module.exports = {
  friendlyName: 'Find a client',
  description: '',
  inputs: {
    id: {
      description: 'ID of the client being fetched.',
      type: 'number',
      required: false
    }
  },
  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/client/find'
    },
    clientDoesNotExist: {
      responseType: 'view',
      viewTemplatePath: '404'
    }
  },
  fn: async function (inputs, exits) {
    const client = await Client.findOne(inputs.id);
    if (!client) {
      return exits.clientDoesNotExist();
    }
    return exits.success({client: client});
  } 
};