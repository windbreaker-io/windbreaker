const { randomNumber } = require('windbreaker-service-util/helpers/randomHelper')

/**
* Generate a random number between 1 and 100000000. Used for creating test
* database Ids.
*/
module.exports = function () {
  return randomNumber(1, 100000000)
}
