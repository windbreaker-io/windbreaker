/**
 * Server start point
 */
require('require-self-ref')
require('marko/node-require')

const config = require('~/src/config')
const startupTasks = require('~/src/startup-tasks')

let logger

// handle startup tasks here
;(async function () {
  try {
    await config.load()
    logger = require('~/src/logging').logger(module)

    await startupTasks.startAll()

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
