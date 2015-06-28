var config = {}

config.service = {
  "prod": "smith-recipe-planner.elasticbeanstalk.com",
  "local": "localhost"
}

config.urlBase = {
  "prod": "",
  "local": "/Recipes"
}

module.exports = config;
