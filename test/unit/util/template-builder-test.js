require('marko/node-require')

const test = require('ava')
const templateBuilder = require('~/src/util/template-builder')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
proxyquire.noPreserveCache()

test.beforeEach((t) => {
  const sandbox = sinon.sandbox.create()

  t.context = {
    sandbox
  }
})

test('should allow building templates', async (t) => {
  const built = await templateBuilder.build('pr', {
    package: {
      name: 'koa',
      version: '1.0.0'
    }
  })

  t.is(built.includes('koa'), true)
  t.is(built.includes('1.0.0'), true)
})

test('should throw error when building and invalid template name', async (t) => {
  const error = await t.throws(templateBuilder.build('INVALID_TEMPLATE_NAME'))
  t.is(error.message, 'Invalid template type: "INVALID_TEMPLATE_NAME"')
})

test('should reject if template rendering rejects', async (t) => {
  const templateBuilder = proxyquire('~/src/util/template-builder', {
    '~/src/util/templates/pr-template': {
      renderToString (data, callback) {
        return callback(new Error('Error rendering!'))
      }
    }
  })

  const error = await t.throws(templateBuilder.build('pr', {
    package: {
      name: 'koa',
      version: '1.0.0'
    }
  }))

  t.is(error.message, 'Error rendering!')
})
