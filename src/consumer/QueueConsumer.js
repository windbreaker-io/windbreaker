/**
 *  A high level ActiveMQ queue consumer
 */
const uuid = require('uuid')
const { EventEmitter } = require('events')
const logger = require('~/src/logging').logger(module)

module.exports = class QueueConsumer extends EventEmitter {
  constructor (queueName, connection) {
    super()
    this._queueName = queueName
    this._connection = connection
    this._channel = null

    this._consumerTag = `${queueName}-consumer-${uuid.v4()}`
  }

  async start () {
    const queueName = this._queueName
    const connection = this._connection
    const consumerTag = this._consumerTag

    logger.info(`Initializing consumer "${consumerTag}"`)

    const channel = this._channel = await connection.createChannel()

    // other assertions may need ot be done on the queue
    await channel.assertQueue(queueName, {
      durable: true
    })

    // NOTE: channel will *only* emit an error if there is a
    // precondition that has failed or if the channel is manually
    // closed via an admin tool
    channel.on('error', (err) => {
      this.emit('error', err)
    })

    // connection will emit an error if a connection
    // to ActiveMQ is lost
    connection.on('error', (err) => {
      this.emit('error', err)
    })

    logger.info(`Starting to consume messages from queue "${queueName}"`)

    // TODO: pause message consumption when max number of
    // inflight messages have been hit
    channel.consume(queueName, (message) => {
      this.emit('message', message)
    })
  }
}
