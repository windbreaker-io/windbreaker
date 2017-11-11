/**
 * Server start point
 */
require('require-self-ref')
require('marko/node-require')

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
    console.error('Error occurred while performing startup tasks', err)
    process.exit(1)
  }

  process.on('uncaughtException', (err) => {
    console.error('UncaughtException', err)
  })

  process.on('unhandledException', (err) => {
    console.error('UnhandledException', err)
  })
}
