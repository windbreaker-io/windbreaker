const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const InstallationEvent = require('windbreaker-service-util/models/events/webhook/github/Installation')

const installation = {
  id: 1,
  app_id: 2
}

const repositories = [{
  id: 3,
  name: 'three-mocha-puppeteers',
  full_name: 'charlieDugong/three-mocha-puppeteers'
}, {
  id: 4,
  name: 'three-mocha-puppeteering',
  full_name: 'charlieDugong/three-mocha-puppeteering'
}]

test.beforeEach(async function (t) {
  const sandbox = sinon.sandbox.create()
  const installationEvent = {
    getData: () => new InstallationEvent({ installation, repositories })
  }
  const mockInstallationDao = {
    upsert: sandbox.stub().throws('not implemented')
  }
  const mockRepositoryDao = {
    upsert: sandbox.stub().throws('not implemented')
  }
  const githubInstallationHandler = proxyquire('~/src/messages/events/webhook/github/github-installation', {
    '~/src/dao/github/installation': mockInstallationDao,
    '~/src/dao/github/repository': mockRepositoryDao
  })

  t.context = {
    mockInstallationDao,
    mockRepositoryDao,
    installationEvent,
    githubInstallationHandler,
    sandbox
  }
})

test.afterEach(async function (t) {
  t.context.sandbox.restore()
})

test('should not upsert repositories if installation upsert fails', async function (t) {
  const {
    mockInstallationDao,
    mockRepositoryDao,
    installationEvent,
    githubInstallationHandler
  } = t.context

  mockInstallationDao.upsert.throws(new Error('kaboom'))

  await t.throws(githubInstallationHandler(installationEvent), 'kaboom')
  sinon.assert.notCalled(mockRepositoryDao.upsert)
})

test('should not bail early on a repository upsert failure', async function (t) {
  const {
    mockInstallationDao,
    mockRepositoryDao,
    installationEvent,
    githubInstallationHandler
  } = t.context

  mockInstallationDao.upsert.returns()
  mockRepositoryDao.upsert.returns()
  mockRepositoryDao.upsert.onFirstCall().throws(new Error('ur db sux'))

  await githubInstallationHandler(installationEvent)
  sinon.assert.calledOnce(mockInstallationDao.upsert)
  sinon.assert.calledTwice(mockRepositoryDao.upsert)
  t.pass()
})

test('should upsert installation and repositories', async function (t) {
  const {
    mockInstallationDao,
    mockRepositoryDao,
    installationEvent,
    githubInstallationHandler
  } = t.context

  mockInstallationDao.upsert.returns()
  mockRepositoryDao.upsert.returns()

  const expectedRepositories = repositories.map((repo) => {
    return { installation_id: installation.id, ...repo }
  })

  await githubInstallationHandler(installationEvent)
  sinon.assert.calledOnce(mockInstallationDao.upsert)
  sinon.assert.calledWithExactly(mockInstallationDao.upsert, installation)
  sinon.assert.calledTwice(mockRepositoryDao.upsert)
  sinon.assert.calledWith(mockRepositoryDao.upsert, expectedRepositories[0])
  sinon.assert.calledWith(mockRepositoryDao.upsert, expectedRepositories[1])

  t.pass()
})
