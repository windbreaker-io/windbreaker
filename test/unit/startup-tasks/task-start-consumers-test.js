require('require-self-ref')

const test = require('ava')

const sinon = require('sinon')
const proxyquire = require('proxyquire')
proxyquire.noPreserveCache()

test.beforeEach('inject mocks', async (t) => {
  const sandbox = sinon.sandbox.create()

  const mockConsumersJob = {
    initialize: sandbox.spy(),
    close: sandbox.spy()
  }

  const startConsumersTask = proxyquire('~/src/startup-tasks/task-start-consumers', {
    '~/src/consumers': mockConsumersJob
  })

  t.context = {
    startConsumersTask,
    mockConsumersJob,
    sandbox
  }
})

test.afterEach('clean up', (t) => {
  const { sandbox } = t.context
  sandbox.restore()
})

test('should create and return consumers when the task has started', async (t) => {
  t.plan(0)

  const {
    startConsumersTask,
    mockConsumersJob,
    sandbox
  } = t.context

  await startConsumersTask.start()

  sandbox.assert.calledOnce(mockConsumersJob.initialize)
})

test('should stop consumers when the task has stopped', async (t) => {
  t.plan(0)

  const {
    startConsumersTask,
    mockConsumersJob,
    sandbox
  } = t.context

  await startConsumersTask.stop()

  sandbox.assert.calledOnce(mockConsumersJob.close)
})
