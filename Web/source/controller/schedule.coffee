module.exports = (app) ->
  app.get '/schedule', (req, res) ->
    res.render('schedule', {})
