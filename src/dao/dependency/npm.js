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

exports.createDao = function () {
  dao = new BaseDao({
    modelType: NpmDependencies
  })
}

/**
* Upserts a new Npm dependencies record in the database, do nothing on conflict
*/
exports.insert = async function (data) {
  const {
    id,
    repo_id: repoId,
    dependencies: deps,
    dev_dependencies: devDeps,
    optional_dependencies: optionalDeps,
    peer_dependencies: peerDeps
  } = cleanModel(data)

  return dao.insert({
    id,
    repo_id: repoId,
    dependencies: JSON.stringify(deps || {}),
    dev_dependencies: JSON.stringify(devDeps || {}),
    optional_dependencies: JSON.stringify(optionalDeps || {}),
    peer_dependencies: JSON.stringify(peerDeps || {})
  })
}

/**
* Upserts a new Npm dependencies record in the database, do nothing on conflict
*/
exports.updateById = async function (id, data) {
  const knex = dao.getKnex()
  const tableName = dao.getTableName()

  const {
    dependencies: deps,
    dev_dependencies: devDeps,
    optional_dependencies: optionalDeps,
    peer_dependencies: peerDeps
  } = cleanModel(data)

  return knex(tableName)
    .where('id', id)
    .update({
      dependencies: JSON.stringify(deps || {}),
      dev_dependencies: JSON.stringify(devDeps || {}),
      optional_dependencies: JSON.stringify(optionalDeps || {}),
      peer_dependencies: JSON.stringify(peerDeps || {})
    })
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
