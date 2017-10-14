/**
* Model for Installations stored in the databases
* __WHEN MODIFIYING THIS FILE__: Update `~/src/dao/migrations` migrations to
* reflect the schema changes.
*/
module.exports = require('windbreaker-service-util/models/Model').extend({
  typeName: 'github_installation',
  properties: {
    id: Number,
    app_id: Number,
    created_at: Date,
    updated_at: Date
  }
})
