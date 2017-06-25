const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const queue = require('windbreaker-service-util/queue')

const EVENTS_QUEUE_NAME = config.getEventsQueueName()
const EVENTS_QUEUE_PREFETCH_COUNT = config.getEventsQueuePrefetchCount()
const WORK_QUEUE_NAME = config.getWorkQueueName()
const WORK_QUEUE_PREFETCH_COUNT = config.getWorkQueuePrefetchCount()
const CONSUMER_RECONNECT_TIMEOUT = config.getConsumerReconnectTimeout()

exports.initialize = async function () {
  const amqUrl = config.getAmqUrl()

  const eventsConsumer = await queue.createConsumer({
    amqUrl,
    logger,
    reconnectTimeout: CONSUMER_RECONNECT_TIMEOUT,
    consumerOptions: {
      queueName: EVENTS_QUEUE_NAME,
      prefetchCount: EVENTS_QUEUE_PREFETCH_COUNT
    },
    async onMessage (message) {
      // TODO: Handle the message
      await Promise.resolve()
    }
  })

  await queue.createConsumer({
    amqUrl,
    logger,
    reconnectTimeout: CONSUMER_RECONNECT_TIMEOUT,
    consumerOptions: {
      queueName: WORK_QUEUE_NAME,
      prefetchCount: WORK_QUEUE_PREFETCH_COUNT,
      connection: eventsConsumer.getConnection()
    },
    async onMessage (message) {
      // TODO: Handle the message
      await Promise.resolve()
    }
  })
}
