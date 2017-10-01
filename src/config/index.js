const configUtil = require('windbreaker-service-util/config')
const path = require('path')

const Config = require('./Config')
const config = module.exports = new Config()

module.exports.load = () => {
  configUtil.load({ config, path: path.join(__dirname, '../../config') })
}
