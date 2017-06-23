/**
 * Exports a logger
 */
const config = require('~/src/config')
const bunyan = require('bunyan')
const PrettyStream = require('bunyan-prettystream')
const prettyStdOut = new PrettyStream()
prettyStdOut.pipe(process.stdout)

const packagePath = require.resolve('~/package.json')
const projectRootPath = packagePath.substring(0, packagePath.length - 'package.json'.length)

const logger = bunyan.createLogger({
  name: 'windbreaker',
  level: config.getLogLevel(),

  // TODO: stream json logs to a file
  streams: [
    {
      type: 'raw',
      stream: prettyStdOut
    }
  ]
})

exports.logger = function (fileModule) {
  let fileName = (fileModule && fileModule.filename) || module.filename
  fileName = fileName.substring(projectRootPath.length)

  return logger.child({ fileName })
}
