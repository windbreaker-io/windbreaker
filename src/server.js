/**
 * Server start point
 */
require('require-self-ref')

const config = require('~/src/config')
config.load()

const logger = require('~/src/logging').logger(module)
const consumers = require('~/src/consumers')

// handle startup tasks here
;(async function () {
  try {
    await consumers.initialize()

    // notify browser refresh
    if (process.send) {
      process.send('online')
    }
  } catch (err) {
    logger.error('Error occurred while performing startup tasks', err)
  }
})()

process.on('uncaughtException', (err) => {
  logger.error('UncaughtException', err)
})

process.on('unhandledException', (err) => {
  logger.error('UnhandledException', err)
})
