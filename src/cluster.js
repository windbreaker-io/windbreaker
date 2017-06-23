/**
 * Spawns a cluster of servers based on the number of cpus available
 * (for use in prod)
 */
require('require-self-ref')

const os = require('os')
const clusterMaster = require('cluster-master')

const numOfCpus = os.cpus().length

clusterMaster({
  exec: require.resolve('~/src/server.js'),
  size: numOfCpus
})
