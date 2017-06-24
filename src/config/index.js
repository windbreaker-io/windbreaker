const registerConfig = require('windbreaker-service-util/config')

const Config = require('./Config')
const config = module.exports = new Config()

registerConfig(config)
