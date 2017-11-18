const Github = require('github')
const { repos } = new Github()

async function getFile ({ owner, repo, path, ref = 'master' }) {
  const { data } = await repos.getContent({ owner, repo, path, ref })
  const { content, encoding } = data

  return JSON.parse(Buffer.from(content, encoding).toString())
}

module.exports = { getFile }
