var express = require('express');
var router = express.Router();
var environments = require('../config/environments')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recipe Planner', activeView: 'upcoming' });
});

router.get('/conn', function(req, res, next) {
    console.log(environments.conString)
  res.json(environments.conString);
});

module.exports = router;
