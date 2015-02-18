var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/schedule', function(req, res, next) {
  res.render('schedule', {});
});

router.get('/recipes', function(req, res, next){
  res.render('recipes', {})
});

module.exports = router;
