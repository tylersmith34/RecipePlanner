var express = require('express')
var router = express.Router()
var planningService = require('./../service/planningService')

router.get('/', function(req, res, next) {
  res.render('plan', {
    title: 'Express'
  })
})

var recipeCallback = function(data, res) {
  res.json(data)
}

router.get('/recipes', function(req, res, next) {
  planningService.loadAllRecipes(recipeCallback, res)
})

router.get('/recipes/tags', function(req, res, next) {
  planningService.loadAllTags(recipeCallback, res)
})

module.exports = router
