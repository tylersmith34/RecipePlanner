var express = require('express');
var router = express.Router();

router.get('/recipes', function(req, res, next){
  res.render('index', {})
});

module.exports = router;
