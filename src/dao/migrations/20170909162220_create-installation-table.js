const logger = require('~/src/logging').logger(module)
const Installation = require('~/src/models/github/Installation')

const INSTALLATION_TABLE_NAME = Installation.typeName

exports.up = function (knex, Promise) {
  logger.info('Attempting to run "up" on "create-installation-table"')
  logger.info('Attempting to create installation table with table name: ', INSTALLATION_TABLE_NAME)

  return knex
    .schema
    .createTableIfNotExists(INSTALLATION_TABLE_NAME, (table) => {
      // TODO: Add more as more properties are added
      // to the Installation model
      table.integer('id').primary()
      table.integer('app_id').notNullable()
      table.timestamps(true, true) // adds created_at/updated_at columns and default to now
    })
}

// This is required by Knex
exports.down = function (knex, Promise) {}
