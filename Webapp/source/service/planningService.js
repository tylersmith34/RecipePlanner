var planningDao = require('./../dao/planningDao')
var offlineRecipes = require('./../../offline/recipes')
var offlineTags = require('./../../offline/tags')

function loadAllRecipes(callback, callingRes) {
  var offline = process.env.recipesOffline;
  if (true) {
    callback(offlineRecipes.recipes, callingRes);
  } else {
    planningDao.loadAllRecipes(callback, callingRes);
  }
}

function loadAllTags(callback, callingRes) {
  var offline = process.env.recipesOffline;
  if (true) {
    callback(offlineTags.tags, callingRes);
  } else {
    planningDao.loadAllTags(callback, callingRes);
  }
}

module.exports.loadAllRecipes = loadAllRecipes;
module.exports.loadAllTags = loadAllTags;
