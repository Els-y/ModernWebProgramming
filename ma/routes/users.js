var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/haslogin', function(req, res, next) {
  if (req.session.user) {
    res.json({
      logined: true,
      user: {
        stuid: req.session.user.stuid,
        name: req.session.user.name,
        class: req.session.user.class,
        group: req.session.user.group,
        role: req.session.user.role
      }
    });
  } else {
    res.json({
      logined: false,
      user: null
    });
  }
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.json({
    success: true
  });
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
  var status = {
    success: false,
    data: {
      user: {
        stuid: req.body.stuid,
        name: '',
        class: null,
        group: null,
        role: null
      },
      info: null
    }
  };
  if (!req.body.stuid || !req.body.password) {
    status.data.info = '用户名或密码未填写';
    return res.json(status);
  }
  User.findOne({stuid: req.body.stuid}).exec().then(function(user) {
    if (user) {
      if (user.comparePassword(req.body.password)) {
        req.session.user = user;
        status.success = true;
        status.data.user = {
          stuid: user.stuid,
          name: user.name,
          class: user.class,
          group: user.group,
          role: user.role
        };
      } else {
        status.data.info = "密码错误";
      }
    } else {
      status.data.info = "用户不存在";
    }
  }).catch(function(reason) {
    status.data.info = "数据库出错";
  }).finally(function() {
    res.json(status);
  });
});

module.exports = router;
