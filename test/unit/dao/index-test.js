/* eslint-disable no-new */

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const config = require('~/src/config')
config.load()

test.beforeEach(function (t) {
  const sandbox = sinon.sandbox.create()
  const argsStub = sandbox.stub()
  class MockFashionKnex {
    constructor (opts) {
      argsStub(opts)
    }
  }
  const BaseDao = proxyquire('~/src/dao', {
    'windbreaker-service-util/dao/FashionKnex': MockFashionKnex
  }).BaseDao

  t.context = { argsStub, BaseDao }
})

test('should pass options through to FashionKnex', function (t) {
  const { BaseDao, argsStub } = t.context
  new BaseDao({ rin: 'okumura' })
  sinon.assert.calledOnce(argsStub)
  sinon.assert.calledWithExactly(argsStub, sinon.match.has('rin', 'okumura'))
  t.pass()
})

test('should add logger and knexConfig to options', function (t) {
  const { BaseDao, argsStub } = t.context
  new BaseDao()
  sinon.assert.calledOnce(argsStub)
  sinon.assert.calledWithExactly(argsStub, sinon.match(opts =>
    opts.logger && opts.knexConfig))
  t.pass()
})
