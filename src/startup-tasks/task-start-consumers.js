module.exports = {
  name: 'start-consumers',

  async start () {
    return require('~/src/consumers').initialize()
  },

  async stop () {
    return require('~/src/consumers').close()
  }
}
