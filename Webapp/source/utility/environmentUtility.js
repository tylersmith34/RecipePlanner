var environments = require('./../config/environments')

function findServiceEnvironment() {
  var environment = process.env.DataSourceEnv;
  return environments.service[environment];
}

function findUrlBaseForEnvironment() {
  var environment = process.env.DataSourceEnv;
  return environments.urlBase[environment];
}

module.exports.findServiceEnvironment = findServiceEnvironment;
module.exports.findUrlBaseForEnvironment  = findUrlBaseForEnvironment;
