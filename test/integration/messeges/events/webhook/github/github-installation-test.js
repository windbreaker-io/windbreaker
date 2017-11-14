const test = require('ava')

const { randomNumber } = require('windbreaker-service-util/helpers/randomHelper')
const githubInstallationHandler = require('~/src/messages/events/webhook/github/github-installation')
const InstallationEvent = require('windbreaker-service-util/models/events/webhook/github/Installation')
const installationDao = require('~/src/dao/github/installation')
const repositoryDao = require('~/src/dao/github/repository')
const integrationTest = require('windbreaker-service-util/testing/integration-test')
const startupTasks = require('~/src/startup-tasks')
const server = require('~/src/server')

integrationTest.register({ test, startupTasks, server })

function pick ({id, name, full_name}) {
  return {id, name, full_name}
}

function randomId () {
  return randomNumber(1, 100000000)
}

test.beforeEach(function (t) {
  const installation = {
    id: randomId(),
    app_id: randomId()
  }

  const repositories = [{
    id: randomId(),
    name: 'three-mocha-puppeteers',
    full_name: 'charlieDugong/three-mocha-puppeteers'
  }, {
    id: randomId(),
    name: 'three-mocha-puppeteering',
    full_name: 'charlieDugong/three-mocha-puppeteering'
  }]

  const installationEvent = {
    getData: () => new InstallationEvent({ installation, repositories })
  }

  t.context = { installation, repositories, installationEvent }
})

test('should store installation and repositories in database', async function (t) {
  const { installation, repositories, installationEvent } = t.context
  await githubInstallationHandler(installationEvent)
  await installationDao.findById(installation.id)
  const repositoryDocOne = await repositoryDao.findById(repositories[0].id)
  const repositoryDocTwo = await repositoryDao.findById(repositories[1].id)
  t.deepEqual(pick(repositoryDocOne.clean()), repositories[0])
  t.deepEqual(pick(repositoryDocTwo.clean()), repositories[1])
})

test('should not store repositories if installation fails to persist', async function (t) {
  const { installation, repositories, installationEvent } = t.context
  installation.id = 'stringsAreInvalidIds'
  await t.throws(githubInstallationHandler(installationEvent), 'id: Invalid value: stringsAreInvalidIds')
  const repositoryDocOne = await repositoryDao.findById(repositories[0].id)
  const repositoryDocTwo = await repositoryDao.findById(repositories[1].id)
  t.is(repositoryDocOne, undefined)
  t.is(repositoryDocTwo, undefined)
})
