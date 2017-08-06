const path = require('path')
const glob = require('glob')

const messageModule = require.resolve('~/src/messages')
const messagesDir = messageModule.substring(0, messageModule.length - '/index.js'.length)

const eventHandlers = {}
let initialized = false

// create a map of message types to handler functions
module.exports = function getEventHandlers () {
  if (!initialized) {
    // walk events dir to get list of event handlers
    const eventHandlerFiles = glob.sync(
      path.resolve(messagesDir, 'events/**/*.js'))

    for (const handlerFile of eventHandlerFiles) {
      const eventName = handlerFile.substring(
        handlerFile.lastIndexOf('/') + 1,
        handlerFile.lastIndexOf('.js'))

      eventHandlers[eventName] = require(handlerFile)
    }

    initialized = true
  }

  return eventHandlers
}
