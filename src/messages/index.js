const Event = require('windbreaker-service-util/models/events/Event')
const _getEventHandlers = require('~/src/util/getEventHandlers')
const logger = require('~/src/logging').logger(module)

const eventHandlers = _getEventHandlers()

exports.handleMessage = async function handleMessage (message) {
  // validate that message is instance of Event
  if (message instanceof Event) {
    const typeName = message.getType().name()

    // pull in event handler
    const handleEvent = eventHandlers[typeName]

    if (handleEvent) {
      logger.info(`handling event with typeName "${typeName}"`)
      await handleEvent(message)
    } else {
      throw new Error(`No handler for the type "${typeName}" exists`)
    }
  } else {
    throw new Error('Incoming message is not an "Event" model')
  }
}
