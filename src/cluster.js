/**
 * Spawns a cluster of servers based on the number of cpus available
 * (for use in prod)
 */
require('require-self-ref')

const clusterUtil = require('windbreaker-service-util/cluster')

clusterUtil.register(
  require.resolve('~/src/run-server.js'),
  process.argv.slice(2))
