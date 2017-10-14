const taskList = require('task-list')
const logger = require('~/src/logging').logger(module)

function _createTasks () {
  return [
    'task-start-consumers',
    'task-connect-to-db'
  ].map((task) => {
    return require(`./${task}`)
  })
}

module.exports = taskList.create({
  tasks: _createTasks(),
  logger
})
