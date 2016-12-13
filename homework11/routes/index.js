var express = require('express');
var router = express.Router();
var User = require('../models/user');
var validator = require('../modules/validator');
var assistant = require('../modules/assistant');

router.get('/', function(req, res, next) {
  if (req.session.user) {
    if (req.query.username &&
        req.query.username !== req.session.user.username)
      req.session.alert = true;
    res.redirect('/users');
  } else {
    res.render('index');
  }
});

router.post('/login', function(req, res, next) {
  var password = assistant.decryptPassword(req.body.password, req.session.token);

  User.findOne({username: req.body.username}).exec().then(function(user) {
    if (user) {
      if (user.comparePassword(password)) {
        req.session.user = user;
        res.redirect('/users');
      } else {
        res.render('index', {warning: "Password wrong"});
      }
    } else {
      res.render('index', {warning: "User does not exist"});
    }
  }).catch(function(reason) {
    console.log(reason);
    res.render('index', {warning: "Database error"});
  });
});

router.get('/regist', function(req, res, next) {
  if (req.session.user) {
    res.redirect('/users');
  } else {
    res.render('regist');
  }
});
router.post('/regist', function(req, res, next) {
  var newUser;
  var userInfo = {
    username: req.body.username,
    password: assistant.decryptPassword(req.body.password, req.session.token),
    stuID: req.body.stuID,
    email: req.body.email,
    phone: req.body.phone
  };

  if (validator.isValidUser(userInfo)) {
    newUser = new User(userInfo);
    newUser.save().then(function(user) {
      console.log("Add new account.");
      console.log(user);
      req.session.user = user;
      res.redirect('/users');
    }).catch(function(reason) {
      console.log(reason);
      res.render('regist');
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

  User.findOne(findInfo).exec().then(function(user) {
    if (user) {
      res.send({success: false, message: message[req.body.key]});
    } else {
      res.send({success: true});
    }
  }).catch(function(reason) {
    console.log(reason);
    res.send({success: false, message: "Database error"});
  });
});

module.exports = router;
