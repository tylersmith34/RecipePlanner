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

function updateRecipe(id, data, callback, callingRes) {
    console.log(data.Description)
    console.log(data.Description !== undefined)
    if(data.Description !== undefined ){
        console.log("in update descr")
        recipeDao.updateDescription(id, data, callback, callingRes);
    }else if(data.Name !== undefined ){
        console.log("in update name")
        recipeDao.updateName(id, data, callback, callingRes);
    }
}

module.exports.loadAllRecipes = loadAllRecipes;
module.exports.loadAllTags = loadAllTags;
module.exports.updateRecipe = updateRecipe;
