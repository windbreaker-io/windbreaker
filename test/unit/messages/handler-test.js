require('require-self-ref')
const test = require('ava')

const proxyquire = require('proxyquire')
proxyquire.noPreserveCache()

const Event = require('windbreaker-service-util/models/events/Event')
const EventType = require('windbreaker-service-util/models/events/EventType')
const { handleMessage } = require('~/src/messages')

test('should be able to handle Event models', async (t) => {
  const event = new Event({
    type: EventType.GITHUB_PUSH,
    data: {
      compare: 'github push'
    }
  })

  await handleMessage(event)

  t.pass()
})

test('should throw error if incoming message is not an Event model', async (t) => {
  const message = { type: 'not an "Event" model' }

  try {
    await handleMessage(message)
    t.fail()
  } catch (err) {
    t.true(err.message.includes('Incoming message is not an "Event" model'))
    t.pass()
  }
})

test('should throw an error if an unsupported event type is given', async (t) => {
  const proxiedHandleMessage = proxyquire('~/src/messages', {
    // return empty map of handlers
    '~/src/util/getEventHandlers': () => {
      return {}
    }
  }).handleMessage

  const event = new Event({
    type: EventType.GITHUB_PUSH,
    data: {
      some: 'data'
    }
  })

  try {
    await proxiedHandleMessage(event)
    t.fail()
  } catch (err) {
    t.true(err.message.includes('No handler'))
    t.pass()
  }
})
