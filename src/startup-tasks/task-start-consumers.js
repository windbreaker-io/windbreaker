module.exports = {
  name: 'Start event consumers',

  async start () {
    return require('~/src/consumers').initialize()
  },

  async stop () {
    return require('~/src/consumers').close()
  }
}
