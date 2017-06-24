const config = require('~/src/config')
const amqplib = require('amqplib')
const logger = require('~/src/logging').logger(module)

const QueueConsumer = require('./QueueConsumer')

const EVENTS_QUEUE_NAME = config.getEventsQueueName()
const EVENTS_QUEUE_PREFETCH_COUNT = config.getEventsQueuePrefetchCount()
const WORK_QUEUE_NAME = config.getWorkQueueName()
const WORK_QUEUE_PREFETCH_COUNT = config.getWorkQueuePrefetchCount()

const CONSUMER_RECONNECT_TIMEOUT = config.getConsumerReconnectTimeout()

let connectionPromise
let amqConnection

/**
 * Creates a connection
 */
async function _getConnection () {
  if (connectionPromise) {
    return connectionPromise
  }

  if (!amqConnection) {
    logger.info(`Attempting to connect to amq ${config.getAmqUrl()}`)
    connectionPromise = amqplib.connect(config.getAmqUrl())
      .then((connection) => {
        amqConnection = connection
        connectionPromise = null
        return connection
      })
      .catch((err) => {
        connectionPromise = null
        amqConnection = null
        throw new Error('Unable to connect to ActiveMQ', err)
      })

    return connectionPromise
  } else {
    return amqConnection
  }
}

async function _startConsumer (queueName, prefetchCount) {
  try {
    const connection = await _getConnection()
    const consumer = new QueueConsumer({
      connection,
      queueName,
      prefetchCount
    })

    consumer.on('message', async (message) => {
      try {
        // TODO: handle messages here

        // acknowledge the message on success
        await consumer.acknowledgeMessage(message)
      } catch (err) {
        logger.error('Error handling message:', err)

        // reject/requeue message
        await consumer.rejectMessage(message)
      }
    })

    const _closeConsumer = async () => {
      await consumer.stop()
      _restartConsumer(queueName, prefetchCount)
    }

    const _handleConnectionClosed = (err) => {
      logger.error('Connection error', err)
      amqConnection = null
      connectionPromise = null
      _closeConsumer()
    }

    consumer.on('error', async (err) => {
      logger.error('Consumer error', err)
      _closeConsumer()
    })

    connection.on('error', _handleConnectionClosed)
    connection.on('close', _handleConnectionClosed)

    await consumer.start()
  } catch (err) {
    logger.error('Error starting consumer', err)
    _restartConsumer(queueName, prefetchCount)
  }
}

function _restartConsumer (queueName, prefetchCount) {
  setTimeout(async () => {
    try {
      logger.info('Restarting event consumer...')
      await _startConsumer(queueName, prefetchCount)
    } catch (err) {
      logger.error('Error restarting event consumer', err)
    }
  }, CONSUMER_RECONNECT_TIMEOUT)
}

exports.initialize = async function () {
  _startConsumer(EVENTS_QUEUE_NAME, EVENTS_QUEUE_PREFETCH_COUNT)
  _startConsumer(WORK_QUEUE_NAME, WORK_QUEUE_PREFETCH_COUNT)
}
