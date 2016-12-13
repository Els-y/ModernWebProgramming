var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', checkNotLogin);
router.get('/', function(req, res, next) {
  if (req.session.alert) {
    req.session.alert = false;
    res.render('user', {user: req.session.user, warning: "You can only see your own information"});
  } else {
    res.render('user', {user: req.session.user});
  }
});

function checkNotLogin(req, res, next) {
  if (!req.session.user)
    return res.redirect('/');
  next();
}

module.exports = router;
