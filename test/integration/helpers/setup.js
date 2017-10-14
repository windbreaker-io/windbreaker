const startupTasks = require('~/src/startup-tasks')
const config = require('~/src/config')

exports.loadConfig = () => config.load()

/**
 * Register before/after hooks to start/stop startup tasks
 * @param  {Object} test Ava instance
 */
exports.registerStartupTasks = function (test) {
  exports.loadConfig()

  test.before(async (t) => {
    await startupTasks.startAll()
  })

  test.after(async () => {
    await startupTasks.stopAll()
  })
}
