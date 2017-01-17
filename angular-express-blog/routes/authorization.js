var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var User = require('../models/user');
var validator = require('../modules/validator');

router.post('/login', function(req, res, next) {
  var status = {
    success: false,
    data: {
      username: req.body.username,
      role: null,
      info: null
    }
  };
  if (!req.body.username || !req.body.password) {
    status.data.info = 'Lack of information';
    return res.json(status);
  }
  User.findOne({username: req.body.username}).exec().then(function(user) {
    if (user) {
      if (user.comparePassword(req.body.password)) {
        req.session.user = user;
        status.success = true;
        status.data.role = user.role;
      } else {
        status.data.info = "Password wrong";
      }
    } else {
      status.data.info = "User does not exist";
    }
  }).catch(function(reason) {
    console.log(reason);
    status.data.info = "Database error";
  }).finally(function() {
    res.json(status);
  });
});

router.post('/regist', function(req, res, next) {
  var newUser;
  var userInfo = {
    password: req.body.password,
    username: req.body.username,
    stuid: req.body.stuid,
    email: req.body.email,
    phone: req.body.phone,
    role: 0
  };
  var status = {
    success: false,
    data: {
      username: null,
      role: null,
      info: null
    }
  };

  if (req.body.confirm !== req.body.password || !validator.isValidUser(userInfo)) {
    status.data.info = "Information invalid";
    res.json(status);
  } else {
    User.checkExist(userInfo).then(function() {
      newUser = new User(userInfo);
      return newUser.save();
    }).then(function(user) {
      console.log("Add new account.");
      console.log(user);
      req.session.user = user;
      status.success = true;
      status.data.username = user.username;
    }).catch(function(reason) {
      console.log(reason);
      status.data.info = reason;
    }).finally(function() {
      res.json(status);
    });
  }
});

router.get('/logout', function(req, res) {
  console.log(req.session.user.username, 'logout');
  req.session.user = null;
  res.json({
    success: true
  });
});

router.post('/checkexist', function(req, res, next) {
  var findInfo = {};
  var message = {
    "username": "Username already exists",
    "stuid": "Student Number already exists",
    "phone": "Phone already exists",
    "email": "Email already exists"
  };
  var status = {
    success: false,
    message: null
  };

  findInfo[req.body.key] = req.body.value;

  User.findOne(findInfo).exec().then(function(user) {
    if (user) {
      status.message = message[req.body.key];
    } else {
      status.success = true;
    }
  }).catch(function(reason) {
    status.message = "Database error";
  }).finally(function() {
    res.json(status);
  });
});

module.exports = router;
