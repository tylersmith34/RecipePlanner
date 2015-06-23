var http = require("http")
var async = require("async")

var recipeOptions = {
  host: 'localhost',
  port: 58864,
  path: '/RecipeService.svc/recipes',
  method: 'GET'
};

var tagOptions = {
  host: 'localhost',
  port: 58864,
  path: '/RecipeService.svc/tags',
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
  http.request(tagOptions, function(res) {
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
