const EventEmitter = require('events')

class MockManagedConsumer extends EventEmitter {
  start () {
    return Promise.resolve()
  }

  stop () {
    return Promise.resolve()
  }

  getConsumer () {}
}

module.exports = MockManagedConsumer
