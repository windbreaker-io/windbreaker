const BaseDao = require('~/src/dao').BaseDao
const Installation = require('~/src/models/github/Installation')

let dao

exports.createDao = function () {
  dao = new BaseDao({
    modelType: Installation
  })
}

/**
* Upserts a new Installation record in the database, do nothing on conflict
* @param id {Number} - github installation id
* @param app_id {Number} - github app id
*/
exports.upsert = async function ({ id, app_id }) {
  return dao.upsert({ id, app_id })
}

exports.findById = async function (id) {
  return dao.findById(id)
}

exports.deleteById = async function (id) {
  return dao.deleteById(id)
}

exports.close = async function () {
  return dao.destroy()
}
