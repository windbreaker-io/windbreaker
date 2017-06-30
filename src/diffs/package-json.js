// Heavily inspired by https://github.com/greenkeeperio/greenkeeper/blob/8be4bfc45dc991ec0c3331ac15b688728f5938a5/lib/diff-package-json.js

const _ = require('windbreaker-service-util/util/objectHelpers')
const types = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]

/**
 * Calculate object representation diff of two package.json objects
 * @param {Object} oldPkg
 * @param {Object} newPkg
 * @return {Object} diff with name and version transition for each changed dep
 */
module.exports = function diff (oldPkg, newPkg) {
  const changes = {}
  for (const type of types) {
    const oldDeps = _.get(oldPkg, type)
    const newDeps = _.get(newPkg, type)
    const allDepNames = _.union(_.keys(oldDeps), _.keys(newDeps))
    for (const depName of allDepNames) {
      const oldVersion = _.get(oldPkg, [type, depName])
      const newVersion = _.get(newPkg, [type, depName])

      if (oldVersion === newVersion) continue
      let change = 'modified'
      if (!oldVersion) {
        change = 'added'
      } else if (!newVersion) {
        change = 'removed'
      }

      _.set(changes, [type, depName], {
        change,
        before: oldVersion,
        after: newVersion
      })
    }
  }
  return changes
}
