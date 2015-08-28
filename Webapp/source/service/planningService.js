var planningDao = require('./../dao/planningDao')
var offlineRecipes = require('./../../offline/recipes')
var offlineTags = require('./../../offline/tags')

function loadAllRecipes(callback, callingRes) {
  if (process.env.recipesOffline) {
    callback(offlineRecipes.recipes, callingRes);
  } else {
    planningDao.loadAllRecipes(callback, callingRes);
  }
}

function loadAllTags(callback, callingRes) {
  if (process.env.recipesOffline) {
    callback(offlineTags.tags, callingRes);
  } else {
    planningDao.loadAllTags(callback, callingRes);
  }
}

module.exports.loadAllRecipes = loadAllRecipes;
module.exports.loadAllTags = loadAllTags;
