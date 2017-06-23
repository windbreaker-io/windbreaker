/**
 * Server start point
 */
require('require-self-ref')

const config = require('~/src/config')
config.load()

const logger = require('~/src/logging').logger(module)
const consumer = require('~/src/consumer')

// handle startup tasks here
;(async function () {
  try {
    await consumer.start()
    if (process.send) {
      process.send('online')
    }
  } catch (err) {
    logger.error('Error occurred while performing startup tasks', err)
  }
})()
