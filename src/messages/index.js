const Event = require('windbreaker-service-util/models/events/Event')
const _getEventHandlers = require('~/src/util/getEventHandlers')

const eventHandlers = _getEventHandlers()

module.exports = async function handleMessage (message) {
  // validate that message is instance of Event
  if (message instanceof Event) {
    const typeName = message.getType().name()

    // pull in event handler
    const handleEvent = eventHandlers[typeName]

    if (handleEvent) {
      await handleEvent(message)
    } else {
      throw new Error(`No handler for the type "${typeName}" exists`)
    }
  } else {
    throw new Error('Incoming message is not an "Event" model')
  }
}
