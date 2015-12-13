var express = require('express');
var router = express.Router();
var environments = require('../config/environments')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recipe Planner', activeView: 'upcoming' });
});

module.exports = router;
