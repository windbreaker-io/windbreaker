/**
 * Exports a logger
 */

const logging = require('windbreaker-service-util/logging')
const config = require('~/src/config')

const packagePath = require.resolve('~/package.json')

logging.configure({
  packagePath,
  logLevel: config.getLogLevel()
})

module.exports = logging
