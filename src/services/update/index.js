const fs = require('fs')

const handlers = {}

const handlersDir = `${__dirname}/handlers`
const handlerFiles = fs.readdirSync(handlersDir)

for (const file of handlerFiles) {
  const { type, handler } = require(`${handlersDir}/${file}`)
  handlers[type.toString()] = handler
}

/**
 * @param { DependencyUpdate } update - the update data
 */
function handleUpdate (update) {
  const type = update.getType().toString()
  const name = update.getName()
  const version = update.getVersion()
  const handleData = handlers[type]

  if (!handleData) {
    throw new Error(`No handler defined for dependency type: ${type}`)
  }

  return handleData(name, version)
}

module.exports = { handleUpdate }
