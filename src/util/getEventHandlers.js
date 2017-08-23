const path = require('path')
const glob = require('glob')

const messagesDir = path.dirname(require.resolve('~/src/messages'))

let eventHandlers

// create a map of message types to handler functions
module.exports = function getEventHandlers () {
  if (!eventHandlers) {
    eventHandlers = {}

    // walk events dir to get list of event handlers
    const eventHandlerFiles = glob.sync(
      path.join(messagesDir, 'events/**/*.js'))

    for (const handlerFile of eventHandlerFiles) {
      const eventName = path.basename(handlerFile, '.js')

      eventHandlers[eventName] = require(handlerFile)
    }
  }

  return eventHandlers
}
