require('require-self-ref')

const logger = require('~/src/logging').logger(module)
const installationDao = require('~/src/dao/github/installation')
const repositoryDao = require('~/src/dao/github/repository')

// TODO: adding caching tier(s)
module.exports = async function (installationEvent) {
  installationEvent = installationEvent.getData()

  const installation = installationEvent.getInstallation()
  const repositories = installationEvent.getRepositories()
  const installationId = installation.getId()

  // bail if installation insert fails
  await installationDao.upsert({
    id: installationId,
    app_id: installation.getApp_id()
  })

  for (const repo of repositories) {
    try {
      await repositoryDao.upsert({
        installation_id: installationId,
        ...repo.clean()
      })
    } catch (error) {
      logger.error('Error while upserting repository, but continuing',
        {repository: repo.clean(), error})
    }
  }
}
