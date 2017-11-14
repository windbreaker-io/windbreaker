module.exports = {
  name: 'start-http-server',

  start () {
    return require('~/src/http-server').create()
  },

  stop () {
    return require('~/src/http-server').close()
  }
}
