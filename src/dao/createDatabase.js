require('require-self-ref')
const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const Knex = require('knex')

config.load()

const knexConfig = config.getKnex().clean()
const dbName = knexConfig.connection.database

// knex breaks if you try to connect to non-existent db.
// Must connect to default DB and create our DB if it doesn't
// exist.
delete knexConfig.connection.database

const knex = Knex(knexConfig)

logger.info(`Attempting to create database '${dbName}'`)
module.exports = knex
  .raw(`CREATE DATABASE ${dbName}`)
  .catch((err) => {
    if (!err.message.includes('already exists')) {
      throw err
    }
  })
  .then(() => knex.destroy())
