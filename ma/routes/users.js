var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var User = require('../models/user');
var settings = require('../modules/settings');

router.get('/haslogin', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      user: null,
      menu: null,
      classes: settings.classes.length
    }
  };

  if (req.session.user) {
    resJson.success = true;
    resJson.data.user = {
      _id: req.session.user._id,
      stuid: req.session.user.stuid,
      name: req.session.user.name,
      class: req.session.user.class,
      group: req.session.user.group,
      role: req.session.user.role
    };
  }

  res.json(resJson);
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.json({
    success: true
  });
});

router.post('/login', function(req, res, next) {
  var status = {
    success: false,
    data: {
      user: {
        _id: null,
        stuid: req.body.stuid,
        name: '',
        class: null,
        group: null,
        role: null
      },
      classes: settings.classes.length,
      err: null
    }
  };
  if (!req.body.stuid || !req.body.password) {
    status.data.err = '用户名或密码未填写';
    return res.json(status);
  }
  User.findOne({stuid: req.body.stuid}).exec().then(function(user) {
    if (user) {
      if (user.comparePassword(req.body.password)) {
        req.session.user = user;
        status.success = true;
        status.data.user = {
          _id: user._id,
          stuid: user.stuid,
          name: user.name,
          class: user.class,
          group: user.group,
          role: user.role
        };
      } else {
        status.data.err = "密码错误";
      }
    } else {
      status.data.err = "用户不存在";
    }
  }).catch(function(reason) {
    status.data.err = "数据库出错";
  }).finally(function() {
    res.json(status);
  });
});

module.exports = router;
