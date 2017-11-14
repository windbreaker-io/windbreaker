require('require-self-ref')
require('marko/node-require')

/**
* Safety check to make sure that while configuring our config or logger we
* didn't throw. If we did, we don't want to swallow errors thrown by our logger
* in the try/catch below or the process exception handlers.
*/
let logger
function logError (message, err) {
  if (logger) logger.error(message, err)
  else console.error(message, err)
}

exports.start = async function (configOverrides) {
  const config = require('~/src/config')
  const startupTasks = require('~/src/startup-tasks')

  try {
    config.load(configOverrides)
    require('~/src/logging').logger(module)

    await startupTasks.startAll()

    // notify browser refresh
    if (process.send) {
      process.send('online')
    }
  } catch (err) {
    logError('Error occurred while performing startup tasks', err)
    process.exit(1)
  }

  process.on('uncaughtException', (err) => {
    logError('UncaughtException', err)
  })

  process.on('unhandledException', (err) => {
    logError('UnhandledException', err)
  })
}
