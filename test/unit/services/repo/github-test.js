const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
proxyquire.noPreserveCache()

const testResponse = require('./fixtures/test-response.json')
const testPackageJson = require('./fixtures/test-package.json')

const testInput = {
  owner: 'druotic',
  repo: 'best dotfiles ever',
  path: 'package.json',
  ref: 'some-commit-sha'
}

test.beforeEach((t) => {
  const getContentStub = sinon.stub()
    .resolves({
      data: testResponse
    })

  class MockGithub {
    constructor () {
      this.repos = {
        getContent: getContentStub
      }
    }
  }

  const proxiedGithubService = proxyquire('~/src/services/repo/github', {
    github: MockGithub
  })

  t.context = {
    getContentStub,
    proxiedGithubService
  }
})

test('should pass in owner, repo, path, and ref to #getContents', async (t) => {
  t.plan(0)
  const { getContentStub, proxiedGithubService } = t.context

  await proxiedGithubService.getFile(testInput)

  sinon.assert.calledOnce(getContentStub)
  sinon.assert.calledWith(getContentStub, testInput)
})

test('should default ref option to master', async (t) => {
  t.plan(0)
  const { getContentStub, proxiedGithubService } = t.context

  const { ref, ...inputWithoutRef } = testInput

  await proxiedGithubService.getFile(inputWithoutRef)

  sinon.assert.calledOnce(getContentStub)
  sinon.assert.calledWith(getContentStub, sinon.match((input) =>
    (input.owner === inputWithoutRef.owner) &&
    (input.repo === inputWithoutRef.repo) &&
    (input.path === inputWithoutRef.path) &&
    (input.ref === 'master')
  ))
})

test('should properly parse the data returned by #getContent', async (t) => {
  t.plan(1)
  const { proxiedGithubService } = t.context

  const packageJson = await proxiedGithubService.getFile(testInput)
  t.deepEqual(packageJson, testPackageJson)
})
