// config model
const DefaultsMixin = require('fashion-model-defaults')

module.exports = require('fashion-model').extend({
  mixins: [ DefaultsMixin ],

  properties: {
    amqUrl: {
      description: 'The url used to access activeMQ',
      default: 'amqp://localhost'
    },

    logLevel: {
      description: 'The level to use for logging',
      default: 'info'
    },

    eventsQueueName: {
      description: 'The name of the queue events are published on',
      default: 'events'
    }
  }
})
