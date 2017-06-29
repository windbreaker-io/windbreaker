// Heavily inspired by https://github.com/greenkeeperio/greenkeeper/blob/8be4bfc45dc991ec0c3331ac15b688728f5938a5/lib/diff-package-json.js

const _ = require('lodash')
const types = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]

module.exports = function (oldPkg, newPkg) {
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
