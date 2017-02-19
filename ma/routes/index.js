var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('layout');
});

router.get('/templates/:name', function(req, res, next) {
  var name = req.params.name;
  res.render('templates/' + name);
});

module.exports = router;
