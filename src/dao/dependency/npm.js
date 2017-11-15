const BaseDao = require('~/src/dao').BaseDao
const NpmDependencies = require('~/src/models/dependencies/Npm')
const cleanModel = require('windbreaker-service-util/models/util/cleanModel')

let dao

/**
 * Helper function for generating query strings
 *
 * @param { Object } knex - the knex instance
 * @param { String } key - the key to look for
 * @param { Field } field - the jsonb field to search
 *
 * NOTE: field needs to be "manually" injected into the template field because
 * knex will wrap the value in quotes if handled injected normally (thus causing
 * the query to be malformed
 */
function _jsonKeyExistsIn (knex, key, field) {
  return knex.raw(`${field}::jsonb ->> ? is not null`, [ key ])
}

function _formatDependencies (data) {
  return {
    dependencies: JSON.stringify(data.dependencies || {}),
    dev_dependencies: JSON.stringify(data.dev_dependencies || {}),
    optional_dependencies: JSON.stringify(data.optional_dependencies || {}),
    peer_dependencies: JSON.stringify(data.peer_dependencies || {})
  }
}

exports.createDao = function () {
  dao = new BaseDao({
    modelType: NpmDependencies
  })
}

/**
* Upserts a new Npm dependencies record in the database, do nothing on conflict
*/
exports.insert = async function (data) {
  data = cleanModel(data)

  return dao.insert({
    id: data.id,
    repo_id: data.repo_id,
    ..._formatDependencies(data)
  })
}

/**
* Upserts a new Npm dependencies record in the database, do nothing on conflict
*/
exports.updateById = async function (id, data) {
  const knex = dao.getKnex()
  const tableName = dao.getTableName()

  data = cleanModel(data)

  return knex(tableName)
    .where('id', id)
    .update(_formatDependencies(data))
}

exports.findByDependency = async function (dependencyName) {
  const knex = dao.getKnex()
  const keyExistsIn = _jsonKeyExistsIn.bind(null, knex, dependencyName)

  const results = await dao
    .select('*')
    .where(keyExistsIn('dependencies'))
    .orWhere(keyExistsIn('dev_dependencies'))
    .orWhere(keyExistsIn('peer_dependencies'))
    .orWhere(keyExistsIn('optional_dependencies'))

  return results.map((result) => dao.wrap(result))
}

exports.close = async function () {
  return dao.destroy()
}
