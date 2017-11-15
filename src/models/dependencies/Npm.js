/**
* Model for Installations stored in the databases
* __WHEN MODIFIYING THIS FILE__: Update `~/src/dao/migrations` migrations to
* reflect the schema changes.
*/
module.exports = require('windbreaker-service-util/models/Model').extend({
  typeName: 'npm_dependencies',
  properties: {
    id: String,

    // foreign key to repo that contains these npm updates
    repo_id: Number,

    // note: each dependency type is stored in a separate key
    // this is done to allow for flexible querying in the future
    // and to avoid situations where the same dependency
    // exists in multiple fields (weird, but nothing can really stop
    // users from doing it)
    dependencies: Object,
    dev_dependencies: Object,
    peer_dependencies: Object,
    optional_dependencies: Object,

    created_at: Date,
    updated_at: Date
  }
})
