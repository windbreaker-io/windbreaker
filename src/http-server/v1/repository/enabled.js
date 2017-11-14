const repositoryDao = require('~/src/dao/github/repository')

module.exports = {
  method: 'GET',
  path: '/v1/repository/:provider/:username/:repo/enabled',
  async handler (ctx) {
    // TODO: Use provider to search (github, bitbucket, etc.)
    const { username, repo } = ctx.request.params
    const repoFullName = `${username}/${repo}`

    const record = await repositoryDao.findByRepoFullName(repoFullName)

    ctx.body = {
      enabled: record.length !== 0
    }
  }
}
