{PlanningService} = require '../service/PlanningService'

planningService = new PlanningService

module.exports = (app) ->
  app.get '/plan', (req, res) ->
    res.render('plan', { } )

  recipeCallback = (data, res) ->
    console.log '================> Recipe data '
    console.log data
    res.json(data)

  app.get '/plan/load', (req, res) ->
    console.log '-------------------- plan'
    planningService.loadRecipes(recipeCallback, res)
