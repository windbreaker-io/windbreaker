const yml = require('js-yaml')
const fs = require('fs')
const Config = require('./Config')

const config = module.exports = new Config()

config.load = function () {
  config.applyDefaults()
  // TODO: allow config values to be overridden via
  // cli args
  const doc = yml.safeLoad(fs.readFileSync(require.resolve('~/server-config.yml')))

  for (const key in doc) {
    config.set(key, doc[key])
  }

  // print config values
  console.log('Config values:')
  const configObj = config.clean()
  for (const key in configObj) {
    console.log(`  ${key}: ${configObj[key]}`)
  }
  console.log('\n')

  // force config to be immutable
  Object.freeze(config)
}
