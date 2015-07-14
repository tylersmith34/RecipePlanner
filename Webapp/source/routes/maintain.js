var express = require('express')
var router = express.Router()
var planningService = require('./../service/planningService')

router.get('/', function(req, res, next) {
  res.render('maintain', { activeView: 'maintain' })
})

router.put('/maintain/recipe/:id/:data', function(req, res, next) {
  console.log("in put for /maintain/recipe " + req.params.id + " data: " + decodeURI(req.params.data))
  res.status(400).send("success")
})

var recipeCallback = function(data, res) {
  res.json(data)
}

module.exports = router
