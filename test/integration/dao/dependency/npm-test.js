const test = require('ava')
const Promise = require('bluebird')
const config = require('~/src/config')

const githubInstallationDao = require('~/src/dao/github/installation')
const githubRepoDao = require('~/src/dao/github/repository')
const npmDao = require('~/src/dao/dependency/npm')

const { randomNumber } = require('windbreaker-service-util/helpers/randomHelper')

const uuid = require('uuid')

config.load()

test.beforeEach('insert test data', async (t) => {
  // init daos
  githubInstallationDao.createDao()
  githubRepoDao.createDao()
  npmDao.createDao()

  const depName = uuid.v4()
  const oldDepName = uuid.v4()
  const newDepName = uuid.v4()

  const installationId = randomNumber()
  const repoId = randomNumber()

  await githubInstallationDao.upsert({
    id: installationId,
    app_id: randomNumber()
  })

  await githubRepoDao.upsert({
    id: repoId,
    name: 'best dotfiles ever',
    full_name: 'druotic/dotfiles',
    installation_id: installationId
  })

  const collection = []

  for (let i = 0; i < 4; i++) {
    collection.push({
      repo_id: repoId,
      dependencies: {
        [ depName ]: '1235.0.0'
      }
    })
  }

  const dataToBeUpdated = {
    id: uuid.v4(),
    repo_id: repoId,
    dependencies: {
      [ oldDepName ]: '0.1.0'
    }
  }

  t.context = {
    depName,
    newDepName,
    oldDepName,
    dataToBeUpdated,
    collection
  }

  return Promise.all([
    Promise.map(collection, (data) => npmDao.insert(data)),
    npmDao.insert(dataToBeUpdated)
  ])
})

test('should be able to query for data contained containing ' +
'the specified dependency', async (t) => {
  const { depName, collection } = t.context

  t.plan(1 + collection.length)

  const results = await npmDao.findByDependency(depName)

  t.is(results.length, 4)

  results.sort((a, b) => a.repo_id > b.repo_id)

  for (let i = 0; i < results.length; i++) {
    t.is(results[i].get('repo_id'), collection[i].repo_id)
  }
})

test('should be able to update a dependency by id', async (t) => {
  t.plan(4)
  const { oldDepName, newDepName, dataToBeUpdated } = t.context

  const results = await npmDao.findByDependency(oldDepName)
  t.is(results.length, 1)

  await npmDao.updateById(dataToBeUpdated.id, {
    dependencies: {
      [ newDepName ]: '1.0.0'
    }
  })

  const newResults = await npmDao.findByDependency(newDepName)
  t.is(newResults.length, 1)

  const [ data ] = newResults
  t.is(data.get('repo_id'), dataToBeUpdated.repo_id)

  const oldResults = await npmDao.findByDependency(oldDepName)
  t.is(oldResults.length, 0)
})
