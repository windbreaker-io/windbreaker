const path = require('path')
const test = require('ava')
const uuid = require('uuid')
const server = require('~/src/server')
const startupTasks = require('~/src/startup-tasks')
const installationDao = require('~/src/dao/github/installation')
const repositoryDao = require('~/src/dao/github/repository')
const addToContext = require('windbreaker-service-util/testing/addToContext')
const payloadTest = require('windbreaker-service-util/testing/payload-test')
const randomId = require('~/test/util/randomId')

async function afterEach (t) {
  const { installationId, repositoryId, testFile } = t.context

  const errors = []

  if (repositoryId) {
    try {
      await repositoryDao.deleteById(repositoryId)
    } catch (err) {
      // If an error is expected, ignore if the delete fails
      if (!testFile.expectError) errors.push(err)
    }

    if (errors.length) {
      throw new Error(`Error(s) occurred while deleting: ${errors.join(',')}`)
    }
  }

  if (installationId) {
    // If this fails, we should still try to delete the repository
    try {
      await installationDao.deleteById(installationId)
    } catch (err) {
      // If an error is expected, ignore if the delete fails
      if (!testFile.expectError) errors.push(err)
    }
  }
}

const payloadTestDir = path.join(__dirname, '../../autotests/http/github-repo-enabled')

payloadTest.register({
  test,
  dir: payloadTestDir,
  server,
  startupTasks,
  buildEndpoint (t) {
    const { httpServerPort, repoFullName } = t.context
    return `:${httpServerPort}/v1/repository/github/${repoFullName}/enabled`
  },
  /**
  * Create the Installation and the Repository that will be used throughout
  * these payload tests
  */
  async beforeEach (t) {
    const installationId = randomId()
    const appId = randomId()

    const repositoryId = randomId()
    const name = 'test-github-repo'
    const repoFullName = uuid.v4() + '/' + name

    addToContext(t, { repoFullName })

    try {
      const installation = await installationDao.upsert({ id: installationId, app_id: appId })
      addToContext(t, { installationId: installation.id })

      const repository = await repositoryDao.upsert({
        id: repositoryId,
        name,
        full_name: repoFullName,
        installation_id: installation.id
      })

      addToContext(t, { repositoryId: repository.id })
    } catch (err) {
      // If there is an error in the beforeEach, we should still try to delete
      // each record
      await afterEach(t)
      throw err
    }
  },
  // Delete the installation and repository
  afterEach
})
