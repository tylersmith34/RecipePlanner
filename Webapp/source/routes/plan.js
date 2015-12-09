var express = require('express')
var router = express.Router()
var planningService = require('./../service/planningService')
var environments = require('../config/environments')

router.get('/', function(req, res, next) {
  res.render('plan', { activeView: 'plan' })
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

router.get('/conn', function(req, res, next) {
    console.log(environments.conString)
  recipeCallback(environments.conString, res);
})

module.exports = router
