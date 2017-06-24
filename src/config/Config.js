// config model
const BaseConfig = require('windbreaker-service-util/models/BaseServiceConfig')

module.exports = BaseConfig.extend({
  properties: {
    amqUrl: {
      description: 'The url used to access activeMQ',
      default: 'amqp://localhost'
    },

    eventsQueueName: {
      description: 'The name of the queue in which events are published on',
      default: 'events'
    },

    workQueueName: {
      description: 'The name of the queue in which work is placed',
      default: 'work'
    },

    eventsQueuePrefetchCount: {
      description: 'The max number of unacknowledged events to pull ' +
        'for the events queue',
      default: 10
    },

    workQueuePrefetchCount: {
      description: 'The max number of unacknowledged events to pull ' +
        'for the work queue',
      default: 10
    },

    consumerReconnectTimeout: {
      description: 'The amount of time to wait before attempting a reconnect (in ms)',
      default: 10000
    }
  }
})
