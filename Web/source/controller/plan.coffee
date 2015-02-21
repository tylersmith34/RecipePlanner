@planningService = require('../service/PlanningService')

module.exports = (app) ->
  app.get '/plan', (req, res) ->
    res.render('plan', {})
