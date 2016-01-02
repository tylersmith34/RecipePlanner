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
      'LEFT JOIN "RecipeTags" rt ON rt."RecipeId" = r.id ' +
      'LEFT JOIN "Tag" t ON rt."TagId" = t.id ORDER BY r.name', function(err, result) {
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

function updateDescription(id, data, callback, res) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        callback(500, "could not connect to the database", res);
        return console.error('could not connect to database', err);
      }
      var query= 'UPDATE "Recipe" SET Description = \'' + data + '\' where id = ' + id;
      console.log(query)
      client.query(query, function(err, result) {
        if(err) {
          callback(500, "error running description update query", res);
          return console.error('error running description update query', err);
        }
        client.end();
        callback(200, "successfully updated recipe description for id: " + id, res);
      });
    });
}

function updateName(id, data, callback, res) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        callback(500, "could not connect to the database", res);
        return console.error('could not connect to database', err);
      }
      client.query('UPDATE "Recipe" SET Name = \'' + data + '\' where id = ' + id, function(err, result) {
        if(err) {
          callback(500, "error running name update query", res);
          return console.error('error running name update query', err);
        }
        client.end();
        callback(200, "successfully updated recipe name for id: " + id, res);
      });
    });
}

function insertRecipe(name, description, tags, callback, res) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        callback(500, "could not connect to the database", res);
        return console.error('could not connect to database', err);
      }
      client.query('INSERT INTO "Recipe" (name, description) VALUES ( \'' + name + '\',\'' + description + '\') RETURNING id', function(err, result) {
        if(err) {
          callback(500, "error running recipe insert query", res);
          return console.error('error running recipe insert query', err);
        }
        client.end();
        insertTags(result.rows[0].id, tags, callback, res);
      });
    });
}

function insertTags(recipeId, tags, callback, res) {
    tags.forEach(function(tagId){
        console.info("inserting tagId: " + tagId + " to recipeId: " + recipeId)
        tagDao.addTagToRecipe(tagId, recipeId, function(){}, res);
    })
    callback(200, String(recipeId), res);
}

function doesRecipeExist(name, callback) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('SELECT name FROM "Recipe" where name = \'' + name + '\'', function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        client.end();
        callback(result.rows.length > 0);
      });
    });
}

module.exports.loadAllRecipes = loadAllRecipes;
module.exports.updateName = updateName;
module.exports.updateDescription = updateDescription;
module.exports.insertRecipe = insertRecipe;
module.exports.doesRecipeExist = doesRecipeExist;
