const BaseDao = require('~/src/dao').BaseDao
const Repository = require('~/src/models/github/Repository')

let dao

exports.createDao = function () {
  dao = new BaseDao({
    modelType: Repository
  })
}

/**
* Upsert a new Repository record in the database, do nothing on conflict
* @param id {Number} - github repository id
* @param name {String} - name of repository
* @param full_name {String} - owner + repository name e.g. druotic/cool-repo
* @param installation_id {Number} - foreign key id for associated installation
*/
exports.upsert = async function ({ id, name, full_name, installation_id }) {
  return dao.upsert({ id, name, full_name, installation_id })
}

exports.findById = async function (id) {
  return dao.findById(id)
}

exports.close = async function () {
  return dao.destroy()
}
