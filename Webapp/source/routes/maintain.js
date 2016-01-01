var express = require('express')
var router = express.Router()
var planningService = require('./../service/planningService')
var tagDao = require('./../dao/tagDao')
var recipeDao = require('./../dao/recipeDao')

router.get('/', function(req, res, next) {
  res.render('maintain', { activeView: 'maintain' })
})

router.put('/maintain/recipe/:id/name/:data', function(req, res) {
  var data = req.params.data
  if(data === 'null') {
    statusCallback(400, 'The name cannot be empty', res);
  } else {
    recipeDao.updateName(req.params.id, data, statusCallback, res);
  }
})

router.put('/maintain/recipe/:id/descr/:data', function(req, res) {
  var data = req.params.data
  if(data === 'null'){
    data = '';
  }
  recipeDao.updateDescription(req.params.id, data, statusCallback, res);
})

router.post('/maintain/recipe/:id/:tagId', function(req, res) {
    tagDao.addTagToRecipe(req.params.tagId, req.params.id, statusCallback, res);
})

router.delete('/maintain/recipe/:id/:tagId', function(req, res) {
     tagDao.removeTagFromRecipe(req.params.tagId, req.params.id, statusCallback, res);
})

router.post('/maintain/new/recipe', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var tags = JSON.parse('[' + req.body.tags + ']');

    recipeDao.doesRecipeExist(name, function(result){
        if (result) {
            statusCallback(400, "Recipe name is already used, please choose another name.", res);
        } else {
            recipeDao.insertRecipe(name, description, tags, statusCallback, res);
        }
    })
})

router.post('/maintain/new/tag', function(req, res) {
    var name = req.body.name;

    tagDao.doesTagExist(name, function(result){
        if (result) {
            statusCallback(400, "Tag name is already used, please choose another name.", res);
        } else {
            tagDao.insertTag(name, statusCallback, res);
        }
    })
})

var recipeCallback = function(data, res) {
  res.json(data)
}

var statusCallback = function(statusCode, message, res) {
    res.status(statusCode).send(message)
}

module.exports = router
