const logger = require('~/src/logging').logger(module)
const NpmProject = require('~/src/models/dependencies/Npm')

const REPOSITORY_TABLE_NAME = NpmProject.typeName

exports.up = function ({ schema }) {
  logger.info('Attempting to run "up" on "create-npm_dependencies-table"')
  logger.info('Attempting to create repository table with table name: ', REPOSITORY_TABLE_NAME)

  return schema
    .createTableIfNotExists(REPOSITORY_TABLE_NAME, (table) => {
      table.string('id').unsigned().primary()

      table.integer('repo_id').unsigned().notNullable()
      table.foreign('repo_id').references('github_repository.id')

      table.jsonb('dependencies')
      table.jsonb('dev_dependencies')
      table.jsonb('peer_dependencies')
      table.jsonb('optional_dependencies')

      table.timestamps(true, true)
    })
}

// This is required by Knex
exports.down = function (knex) {}
