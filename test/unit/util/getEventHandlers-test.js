require('require-self-ref')
const test = require('ava')

const sinon = require('sinon')
const proxyquire = require('proxyquire')
proxyquire.noPreserveCache()

const getEventHandlers = require('~/src/util/getEventHandlers')

test('should return event handlers based on files provided in the ' +
  '"src/messages/events" directory', async (t) => {
  const eventHandlers = getEventHandlers()
  t.true(typeof eventHandlers['github-push'] === 'function')
})

test('should not perform traversal again if already initialized', async (t) => {
  const githubPushHandlerPath =
    require.resolve('~/src/messages/events/webhook/github/github-push')

  const globSyncStub = sinon.stub()
    .returns([ githubPushHandlerPath ])

  const proxyedGetEventHandlers = proxyquire('~/src/util/getEventHandlers', {
    glob: {
      sync: globSyncStub
    },

    [ githubPushHandlerPath ]: sinon.stub()
  })

  // first call to getEventHandlers perform a traversal using glob
  const eventHandlersA = proxyedGetEventHandlers()
  sinon.assert.calledOnce(globSyncStub)

  // subsequent calls should not perform a traversal
  const eventHandlersB = proxyedGetEventHandlers()
  sinon.assert.calledOnce(globSyncStub)

  t.is(eventHandlersA, eventHandlersB)
})
