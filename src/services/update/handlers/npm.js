const DependencyType = require('windbreaker-service-util/models/events/dependency/DependencyType')
// const npmDao = require('~/src/dao/dependency/npm')

module.exports = {
  type: DependencyType.NPM,
  async handler (name, version) {
    /*
    const records = await npmDao.findByDependency(name)

    for (const record of records) {
      // handle semver here
    }
    */
  }
}
