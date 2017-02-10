var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/haslogin', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      user: null,
      menu: null
    }
  };

  if (req.session.user) {
    resJson.success = true;
    resJson.data.user = {
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
        stuid: req.body.stuid,
        name: '',
        class: null,
        group: null,
        role: null
      },
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
