const updateService = require('~/src/services/update')

module.exports = function handleUpdateEvent (updateEvent) {
  return updateService.handleUpdate(updateEvent)
}
