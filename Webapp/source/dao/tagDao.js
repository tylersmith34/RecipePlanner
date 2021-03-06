var pg = require('pg');
var environments = require('../config/environments')
var conString = environments.conString;

function loadTags(callback, callbackRes) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to database', err);
      }
      client.query('SELECT * FROM "Tag"', function(err, result) {
        if(err) {
          return console.error('error running query to select tags', err);
        }
        client.end();
        callback(mapRows(result.rows), callbackRes);
      });
    });
}

function removeTagFromRecipe(tagId, recipeId, callback, res) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to database', err);
      }
      client.query('DELETE FROM "RecipeTags" WHERE "RecipeId" = ' + recipeId + ' AND "TagId" = ' + tagId, function(err, result) {
        if(err) {
          return console.error('error running delete query', err);
        }
        client.end();
        callback(200, "successfully removed tag " + tagId + " from recipe " + recipeId, res);
      });
    });
}

function addTagToRecipe(tagId, recipeId, callback, res) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        callback(500, "could not connect to the database", res);
        return console.error('could not connect to database', err);
      }
      client.query('INSERT INTO "RecipeTags" VALUES (' + recipeId + ' , ' + tagId + ')', function(err, result) {
        if(err) {
          callback(500, "successfully added tag " + tagId + " to recipe " + recipeId, res);
          return console.error('error running insert query', err);
        }
        client.end();
        console.log("successfully added tag " + tagId + " to recipe " + recipeId)
        callback(200, "successfully added tag " + tagId + " to recipe " + recipeId, res);
      });
    });
}

function doesTagExist(name, callback) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('SELECT name FROM "Tag" where name = \'' + name + '\'', function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        client.end();
        callback(result.rows.length > 0);
      });
    });
}

function insertTag(name, callback, res) {
    var client = new pg.Client(conString);

    client.connect(function(err) {
      if(err) {
        callback(500, "could not connect to the database", res);
        return console.error('could not connect to database', err);
      }
      client.query('INSERT INTO "Tag" (name) VALUES ( \'' + name + '\') RETURNING id', function(err, result) {
        if(err) {
          callback(500, "error running tag insert query", res);
          return console.error('error running tag insert query', err);
        }
        client.end();
        callback(200, String(result.rows[0].id), res);
      });
    });
}

function mapRows(tags){
    var mappedTags = [];
    for (tag of tags){
        mappedTags.push({Id: tag.id, Name: tag.name});
    }
    return mappedTags;
}

module.exports.loadTags = loadTags;
module.exports.addTagToRecipe = addTagToRecipe;
module.exports.removeTagFromRecipe = removeTagFromRecipe;
module.exports.doesTagExist = doesTagExist;
module.exports.insertTag = insertTag;
