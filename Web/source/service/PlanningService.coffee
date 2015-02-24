http = require 'http'

class PlanningService
  constructor: ->
    loadRecipes = (callback, planResponse) ->
      get = http.request 'http://localhost:58864/RecipeService.svc/recipes'
      , (res) ->
        console.log 'in get'
        res.on 'data', (chunk) ->
          recipes += chunk

        res.on 'end', ->
          recipes = JSON.parse(recipes)
          console.log 'data'
          console.log recipes
          callback(recipes, planResponse)
          return recipes

      get.end()

exports.PlanningService = PlanningService
