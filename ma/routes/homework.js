var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var Homework = require('../models/homework');

router.get('/getOneById/:id', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      homework: {},
      err: null
    }
  };
  if (!req.session.user || !req.params.id) return res.json(resJson);
  Homework.findById(req.params.id).exec().
    then(function(homework) {
      if (homework) {
        resJson.success = true;
        resJson.data.homework = homework;
      }
    }).catch(function(err) {
      resJson.data.err = '数据库出错';
    }).finally(function() {
      res.json(resJson);
    });
});

router.get('/getAll', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      list: [],
      err: null
    }
  };
  var queryInfo = {};

  if (!req.session.user) return res.json(resJson);
  if (req.session.user.role === 0) {
    queryInfo.class = req.session.user.class;
  }

  Homework.
    find(queryInfo).
    exec().
    then(function(homeworks) {
      resJson.success = true;
      resJson.data.list = homeworks;
    }).catch(function() {
      resJson.data.err = '数据库出错';
    }).finally(function() {
      res.json(resJson);
    });
});

router.post('/single', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      homework: {},
      err: null
    }
  };

  if (!req.session.user ||
      req.session.user.role === 0 ||
      !req.body.class ||
      !req.body.title ||
      !req.body.url ||
      !req.body.begin ||
      !req.body.review ||
      !req.body.end) return res.json(resJson);

  var homework = new Homework({
    class: req.body.class,
    title: req.body.title,
    url: req.body.url,
    beginTime: req.body.begin,
    reviewTime: req.body.review,
    endTime: req.body.end,
    status: 0
  });

  homework.save().
    then(function(homework) {
      resJson.success = true;
      resJson.data.homework = homework;
    }).catch(function(err) {
      resJson.data.err = '数据库出错';
    }).finally(function() {
      res.json(resJson);
    });
});

router.put('/single', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      homework: {},
      err: null
    }
  };
  if (!req.session.user ||
      req.session.user.role === 0 ||
      !req.body.class ||
      !req.body.title ||
      !req.body.url ||
      !req.body.begin ||
      !req.body.review ||
      !req.body.end ||
      !req.body._id) return res.json(resJson);

  Homework.findById(req.body._id).exec().
    then(function(homework) {
      if (homework) {
        homework.title = req.body.title;
        homework.url = req.body.url;
        homework.beginTime = req.body.begin;
        homework.reviewTime = req.body.review;
        homework.endTime = req.body.end;
        return homework.save();
      } else {
        return Promise.reject('作业不存在');
      }
    }).then(function(homework) {
      resJson.data.homework = homework;
      resJson.success = true;
    }).catch(function(err) {
      resJson.data.err = '数据库出错';
    }).finally(function() {
      res.json(resJson);
    });
});

module.exports = router;
