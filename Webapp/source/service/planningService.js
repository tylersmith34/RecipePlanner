var http = require("http")
var async = require("async")
var environmentUtility = require('./../utility/environmentUtility')

var recipeOptions = {
  host: environmentUtility.findServiceEnvironment(),
  path: environmentUtility.findUrlBaseForEnvironment() + '/RecipeService.svc/recipes',
  method: 'GET'
};

var tagOptions = {
  host: environmentUtility.findServiceEnvironment(),
  path: environmentUtility.findUrlBaseForEnvironment() + '/RecipeService.svc/tags',
  method: 'GET'
};

function loadAllRecipes(callback, callingRes) {
  http.request(recipeOptions, function(res) {
    res.setEncoding('utf8');
    var recipesResponse = '';
    res.on('data', function(data) {
      recipesResponse += data;
    });
    res.on('end', function() {
      callback(JSON.parse(recipesResponse), callingRes);
    });
  }).end();
}

function loadAllTags(callback, callingRes) {
  var req = http.request(tagOptions, function(res) {
    res.setEncoding('utf8');
    var tagsResponse = '';
    res.on('data', function(data) {
      tagsResponse += data;
    });
    res.on('end', function() {
      callback(JSON.parse(tagsResponse), callingRes);
    });
  }).end();
}

module.exports.loadAllRecipes = loadAllRecipes;
module.exports.loadAllTags = loadAllTags;
