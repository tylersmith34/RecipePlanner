var config = {}
var conString = "postgres://recipes:" + process.env.db_password + "@recipespostgres.c2xfgvgbz8hi.us-west-2.rds.amazonaws.com:5432/Recipe";

config.database = {
    "local": "postgres://recipes:" + process.env.db_password + "@recipespostgres.c2xfgvgbz8hi.us-west-2.rds.amazonaws.com:5432/Recipe",
    "prod": "postgres://recipes:" + process.env.db_password + "@recipespostgres.c2xfgvgbz8hi.us-west-2.rds.amazonaws.com:5432/Recipe"
}

module.exports = config;
module.exports.conString = conString;
