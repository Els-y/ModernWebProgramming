var express = require('express');
var router = express.Router();
var User = require('../models/user');
var validator = require('../validator');

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
  if (req.query.username) {
    User.findOne({username: req.query.username}, function(err, user) {
      if (err) {
        console.log(err);
      } else if (user) {
        return res.render('user', {user: user});
      }
      res.render('index');
    });
  } else {
    res.render('index');
  }
});
router.post('/', function(req, res, next) {
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
      console.log(err);
    } else if (user) {
      if (user.comparePassword(req.body.password)) {
        req.session.user = user;
        res.redirect('/users');
      } else {
        res.render('index', {warning: "Password wrong"});
      }
    } else {
      res.render('index', {warning: "User does not exist"});
    }
  });
});

router.get('/regist', checkLogin);
router.get('/regist', function(req, res, next) {
  res.render('regist');
});
router.post('/regist', function(req, res, next) {
  var userInfo = {
    username: req.body.username,
    password: req.body.password,
    stuID: req.body.stuID,
    email: req.body.email,
    phone: req.body.phone
  };

  if (validator.isValidUser(userInfo)) {
    user = new User(userInfo);
    user.save(function(err, u) {
      if (err) {
        console.log(err);
      } else {
        console.log("Add new account.");
        req.session.user = u;
        res.redirect('/users');
      }
    });
  } else {
    res.render('regist');
  }
});

router.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

router.post('/checkexist', function(req, res, next) {
  var findInfo = {};
  var message = {
    "username": "Username already exists",
    "stuID": "Student Number already exists",
    "phone": "Phone already exists",
    "email": "Email already exists"
  };
  findInfo[req.body.key] = req.body.value;
  User.findOne(findInfo, function(err, user) {
    if (err) {
      console.log(err);
    } else if (user) {
      res.send({success: false, message: message[req.body.key]});
    } else {
      res.send({success: true});
    }
  });
});

function checkLogin(req, res, next) {
  console.log("checklogin");
  console.log(req.session.user);
  console.log("checklogin");

  if (req.session.user)
    return res.redirect('/users');
  next();
}

module.exports = router;
