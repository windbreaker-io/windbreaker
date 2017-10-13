require('require-self-ref')
const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const Knex = require('knex')
const createDatabase = require('windbreaker-service-util/dao/_migration-helpers/createDatabase')

config.load()

const knexConfig = config.getKnex().clean()
const dbName = knexConfig.connection.database

// knex breaks if you try to connect to non-existent db.
// Must connect to default DB and create our DB if it doesn't
// exist.
delete knexConfig.connection.database

const knex = Knex(knexConfig)

;(async function () {
  logger.info(`Attempting to create database '${dbName}'`)
  try {
    await createDatabase(knex, dbName)
  } catch (err) {
    logger.error(`Error while creating database '${dbName}'`, err)
    process.exit(1)
  }
})()
