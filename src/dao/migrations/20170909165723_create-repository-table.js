const logger = require('~/src/logging').logger(module)
const Repository = require('~/src/models/github/Repository')

const REPOSITORY_TABLE_NAME = Repository.typeName

exports.up = function (knex, Promise) {
  logger.info('Attempting to run "up" on "create-repository-table"')
  logger.info('Attempting to create repository table with table name: ', REPOSITORY_TABLE_NAME)

  return knex
    .schema
    .createTableIfNotExists(REPOSITORY_TABLE_NAME, (table) => {
      // Can only have one installation per repository (one install of our app
      // per account) - guaranteed to be unique.
      table.integer('id').unsigned().primary()
      table.integer('installation_id').unsigned().notNullable()
      table.foreign('installation_id').references('github_installation.id')
      table.string('name').notNullable()
      table.string('full_name').notNullable()
      table.timestamps(true, true) // adds created_at/updated_at columns and default to now
    })
}

// This is required by Knex
exports.down = function (knex, Promise) {}
