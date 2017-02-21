var express = require('express');
var router = express.Router();
var path = require('path');
var Promise = require('bluebird');
var multer = require('multer');
var settings = require('../modules/settings');

var Homework = require('../models/homework');
var Upload = require('../models/upload');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var filepath = path.join(settings.uploadsPath, 'class' + req.session.user.class);
    cb(null, filepath);
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    var fileName = '' + req.body.index + '-' + req.session.user.group + '-' + req.session.user.name + '.' + fileFormat[fileFormat.length - 1];
    cb(null, fileName);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

function fileFilter(req, file, cb) {
  if (!req.session.user) {
    cb(null, false);
  } else {
    Homework.findById(req.body._id).exec().
      then(function(homework) {
        var timenow = new Date();
        if (homework && timenow >= homework.beginTime && timenow <= homework.endTime) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      });
  }
}

router.post('/code', upload.single('code'), function(req, res, next) {
  if (!req.session.user) return res.status(500).end();

  var uploadInfo = {
    author: req.session.user,
    homework: null,
    class: req.session.user.class,
    group: req.session.user.group,
    filename: req.file.filename,
    github: '',
  };

  Homework.findById(req.body._id).exec().
    then(function(homework) {
      var timenow = new Date();
      if (homework && timenow >= homework.beginTime && timenow <= homework.endTime) {
        uploadInfo.homework = homework;
        if (checkSubmitted(homework, req.session.user)) {
          return Promise.resolve(homework);
        } else {
          homework.submitted.push(req.session.user);
          return homework.save();
        }
      } else {
        return Promise.reject();
      }
    }).then(function(homework) {
      return Upload.findOne({
        author: req.session.user._id,
        homework: homework._id
      }).exec();
    }).then(function(upload) {
      if (upload) {  // 已提交过
        upload.filename = req.file.filename;
        return upload.save();
      } else {  // 第一次提交
        return new Upload(uploadInfo).save();
      }
    }).then(function(upload) {
      res.end();
    }).catch(function() {
      res.status(500).end();
    });
});

router.post('/img', upload.single('img'), function(req, res, next) {
  res.end();
});

router.post('/github', function(req, res, next) {
  var resJson = {
    success: false
  };

  if (!req.session.user) return res.json(resJson);

  var uploadInfo = {
    author: req.session.user,
    homework: null,
    class: req.session.user.class,
    group: req.session.user.group,
    filename: '',
    github: req.body.github
  };
  Homework.findById(req.body._id).exec().
    then(function(homework) {
      var timenow = new Date();
      if (homework && timenow >= homework.beginTime && timenow <= homework.endTime) {
        uploadInfo.homework = homework;
        if (checkSubmitted(homework, req.session.user)) {
          return Promise.resolve(homework);
        } else {
          homework.submitted.push(req.session.user);
          return homework.save();
        }
      } else {
        return Promise.reject();
      }
    }).then(function(homework) {
      return Upload.findOne({
        author: req.session.user._id,
        homework: homework._id
      }).exec();
    }).then(function(upload) {
      if (upload) {  // 已提交过
        upload.github = req.body.github;
        return upload.save();
      } else {  // 第一次提交
        return new Upload(uploadInfo).save();
      }
    }).then(function(upload) {
      resJson.success = true;
    }).catch(function(err) {
      resJson.success = false;
    }).finally(function() {
      res.json(resJson);
    });
});

router.get('/download', function(req, res, next) {
  if (!req.session.user) return res.status(404).end();

  Upload.findOne({
    author: req.query.author,
    homework: req.query.homework,
  }).exec().then(function(upload) {
    if (upload && upload.filename) {
      return Promise.resolve(upload);
    } else {
      return Promise.reject();
    }
  }).then(function(upload) {
    var filepath = path.join(
      settings.uploadsPath,
      'class' + upload.class,
      upload.filename
    );
    res.download(filepath);
  }).catch(function() {
    res.end();
  });
});

function checkSubmitted(homework, user) {
  return homework.submitted.some(function (submit) {
    return submit.equals(user._id);
  });
}

module.exports = router;
