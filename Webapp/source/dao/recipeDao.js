var pg = require('pg');
var tagDao = require('./tagDao');
var environments = require('../config/environments')
var conString = environments.conString;

function loadAllRecipes(callback, callbackRes) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('SELECT r.id, r.name, r.description, t.id as tagId, t.name as tagName FROM "Recipe" r ' +
      'join "RecipeTags" rt on rt."RecipeId" = r.id ' +
      'join "Tag" t on rt."TagId" = t.id order by r.id', function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        client.end();
        var recipesWithTags = mapRecipesAndTags(result.rows);
        callback(recipesWithTags, callbackRes);
      });
    });
}

function mapRecipesAndTags(recipeTagMap){
    var parsedRecipes = [];
    for (recipe of recipeTagMap){
        if(!isRecipeInList(parsedRecipes, recipe.id)){
            parsedRecipes.push({Id: recipe.id, Name: recipe.name, Description: recipe.description});
        }
    }

    parsedRecipes.forEach(function(recipe){
        recipe.Tags = findTagsForRecipe(recipeTagMap, recipe.Id)
    });

    return parsedRecipes;
}

function isRecipeInList(recipes, id){
    var found = false;
    recipes.forEach(function(recipe){
        if(recipe.Id == id){
            found = true;
        }
    });
    return found;
}

function findTagsForRecipe(recipeTagMap, recipeId){
    var tags = [];
    recipeTagMap.forEach(function(recipeTag){
        if(recipeTag.id === recipeId){
            tags.push({Id: recipeTag.tagid, Name: recipeTag.tagname})}
    });
    return tags;
}

module.exports.loadAllRecipes = loadAllRecipes;
