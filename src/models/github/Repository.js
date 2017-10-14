/**
* Model for Repository stored in the databases
* __WHEN MODIFIYING THIS FILE__: Update `~/src/dao/migrations` migrations to
* reflect the schema changes.
*/
module.exports = require('windbreaker-service-util/models/Model').extend({
  typeName: 'github_repository',
  properties: {
    id: Number,
    name: String,
    full_name: String,
    installation_id: Number,
    created_at: Date,
    updated_at: Date
  }
})
