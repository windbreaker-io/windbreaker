const test = require('ava')

const config = require('~/src/config')

const sinon = require('sinon')
const proxyquire = require('proxyquire')
proxyquire.noPreserveCache()

test.before('setup config', async () => {
  return config.load()
})

test.beforeEach('initialize consumers and producers', async (t) => {
  const sandbox = sinon.sandbox.create()

  const consumers = proxyquire('~/src/consumers', {})

  const { eventConsumer, workConsumer } = await consumers.initialize()

  t.context = {
    consumers,
    eventConsumer,
    workConsumer,
    sandbox
  }
})

test.afterEach('teardown test environment', async (t) => {
  const {
    consumers,
    sandbox
  } = t.context

  await consumers.close()

  sandbox.restore()
})

test('should call for each consumer to stop upon closing', async (t) => {
  t.plan(0)

  const {
    eventConsumer,
    workConsumer,
    consumers,
    sandbox
  } = t.context

  const eventConsumerStopSpy = sandbox.spy(eventConsumer, 'stop')
  const workConsumerStopSpy = sandbox.spy(workConsumer, 'stop')

  await consumers.close()

  sandbox.assert.calledOnce(eventConsumerStopSpy)
  sandbox.assert.calledOnce(workConsumerStopSpy)
})
