const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const FashionKnex = require('windbreaker-service-util/dao/FashionKnex')

// TODO: move this base implementation class to shared utils?
class BaseDao extends FashionKnex {
  constructor (options) {
    const newOptions = {
      ...options,
      logger,
      knexConfig: config.getKnex()
    }
    super(newOptions)
  }
}

exports.BaseDao = BaseDao
