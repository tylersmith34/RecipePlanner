module.exports = (app) ->
  app.get '/recipes', (req, res) ->
    res.render('recipes', {})
