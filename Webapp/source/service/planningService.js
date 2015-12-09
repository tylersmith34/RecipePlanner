var tagDao = require('./../dao/tagDao')
var recipeDao = require('./../dao/recipeDao')
var offlineRecipes = require('./../../offline/recipes')
var offlineTags = require('./../../offline/tags')

function loadAllRecipes(callback, callingRes) {
  if (process.env.recipesOffline) {
    callback(offlineRecipes.recipes, callingRes);
  } else {
    recipeDao.loadAllRecipes(callback, callingRes);
  }
}

function loadAllTags(callback, callingRes) {
  if (process.env.recipesOffline) {
    callback(offlineTags.tags, callingRes);
  } else {
    tagDao.loadTags(callback, callingRes);
  }
}

module.exports.loadAllRecipes = loadAllRecipes;
module.exports.loadAllTags = loadAllTags;
