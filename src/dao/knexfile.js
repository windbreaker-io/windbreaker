require('require-self-ref')
const config = require('~/src/config')

config.load()

const environment = config.getEnvironment().name().toLowerCase()
exports[environment] = config.getKnex().clean()
