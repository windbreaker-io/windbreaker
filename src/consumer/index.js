const config = require('~/src/config')
const amqplib = require('amqplib')
const logger = require('~/src/logging').logger(module)

const QueueConsumer = require('./QueueConsumer')
let amqConnection
let consumer

const start = exports.start = async function () {
  logger.debug('Connecting to ActiveMQ')
  try {
    amqConnection = await amqplib.connect(config.getAmqUrl())
    consumer = new QueueConsumer(config.getEventsQueueName(), amqConnection)

    consumer.on('message', (message) => {
      // handle messages here
    })

    consumer.on('error', (err) => {
      logger.error('Consumer error', err)
      consumer.stop()
      _restart()
    })

    await consumer.start()
  } catch (err) {
    logger.error('Error starting consumer', err)
    _restart()
  }
}

function _restart () {
  setTimeout(async () => {
    try {
      logger.info('Restarting event consumer...')
      await start()
    } catch (err) {
      logger.error('Error restarting event consumer', err)
    }
  }, 1000)
}
