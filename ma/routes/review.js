var express = require('express');
var router = express.Router();
var path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');

var User = require('../models/user');
var Homework = require('../models/homework');
var Upload = require('../models/upload');
var Review = require('../models/review');

router.get('/from', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      reviews: null
    }
  };

  if (!req.session.user ||
      !req.query.homework) return res.json(resJson);

  Review.find({
    homework: req.query.homework,
    to: req.session.user._id
  }).sort({'type': 'desc'}).exec().
    then(function(reviews) {
      resJson.success = true;
      resJson.data.reviews = reviews;
    }).finally(function() {
      res.json(resJson);
    });
});

router.get('/to', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      maxScore: null,
      status: null,
      uploads: []
    }
  };

  if (!req.session.user ||
      !req.query.homework) return res.json(resJson);

  Homework.findById(req.query.homework).exec().
    then(function(homework) {
      if (homework) {
        resJson.data.maxScore = homework.maxScore;
        resJson.data.status = homework.status;
        return Promise.resolve(homework);
      } else {
        return Promise.reject();
      }
    }).then(function(homework) {
      var promiseArr;
      if (req.session.user.role === 0) {
        promiseArr = [
          Upload.find({
            homework: homework._id,
            group: homework.reviewGroup[req.session.user.group - 1]
          }).populate({path: 'author', select: '-password'}).exec(),
          Review.find({
            homework: homework._id,
            from: req.session.user._id,
          }).exec()
        ];
      } else {
        promiseArr = [
          Upload.find({
            homework: homework._id,
          }).populate({
            path: 'author',
            select: '-password'
          }).sort({
            'group': 'asc'
          }).exec(),
          Review.find({
            homework: homework._id,
            from: req.session.user._id,
          }).exec()
        ];
      }
      return Promise.all(promiseArr);
    }).spread(function(uploads, reviews) {
      var arr = [];
      uploads.map(function(upload) {
        arr.push({
          _id: upload._id,
          author: {
            _id: upload.author._id,
            stuid: upload.author.stuid,
            name: upload.author.name,
            class: upload.author.class,
            group: upload.author.group,
            role: upload.author.role,
          },
          homework: upload.homework,
          group: upload.group,
          filename: upload.filename,
          github: upload.github
        });
      });

      reviews.map(function(review) {
        var index = _.findIndex(arr, {
          author: {
            _id: review.to
          }
        });
        arr[index].review = review;
      });

      arr.map(function(upload) {
        if (upload.filename) {
          var imgname = upload.filename.split('.')[0] + '.png';
          var imgpath = path.join('/class' + upload.author.class, imgname);
          upload.img = imgpath;
        }
      });

      resJson.success = true;
      resJson.data.uploads = arr;
    }).finally(function() {
      res.json(resJson);
    });
});

router.post('/to', function(req, res, next) {
  var resJson = {
    success: false,
    data: {
      review: null,
      err: null
    }
  };

  if (!req.session.user ||
      !req.body.homework ||
      !req.body.to ||
      !req.body.content ||
      !req.body.score) return res.json(resJson);

  var reviewInfo = {
    from: req.session.user,
    to: null,
    homework: null,
    content: req.body.content,
    score: req.body.score,
    type: req.session.user.role
  };

  Homework.findById(req.body.homework).exec().
    then(function(homework) {
      if (homework && checkReviewValid(homework, req.session.user)) {
        if (checkScoreValid(homework, req.body.score)) {
          reviewInfo.homework = homework;
          return User.findById(req.body.to).exec();
        } else {
          return Promise.reject();
        }
      } else {
        return Promise.reject();
      }
    }).then(function(user) {
      if (user) {
        reviewInfo.to = user;
        return new Review(reviewInfo).save();
      } else {
        return Promise.reject();
      }
    }).then(function(review) {
      resJson.success = true;
      resJson.data.review = review;
    }).catch(function() {
      resJson.success = false;
    }).finally(function() {
      res.json(resJson);
    });
});

router.post('/confirm', function(req, res, next) {
  var resJson = {
    success: false
  };
  if (!req.session.user ||
      !req.body.signature ||
      !req.body.homework ||
      req.session.user.name !== req.body.signature)
    return res.json(resJson);

  Homework.findById(req.body.homework).exec().
    then(function(homework) {
      if (homework) {
        return Promise.resolve(homework);
      } else {
        return Promise.reject();
      }
    }).then(function(homework) {
      if (req.session.user.role === 1 && homework.status === 0) {
        homework.status = 1;
        return homework.save();
      } else if (req.session.user.role === 2 && homework.status === 1) {
        homework.status = 2;
        return homework.save();
      } else {
        return Promise.reject();
      }
    }).then(function(homework) {
      resJson.success = true;
    }).finally(function() {
      res.json(resJson);
    });
});

function checkScoreValid(homework, score) {
  var value = Number(score);
  return !isNaN(value) &&
    value >= 0 &&
    value <= homework.maxScore &&
    value % 1 === 0;
}

function checkReviewValid(homework, user) {
  var timenow = new Date();

  if (user.role === 0 && timenow >= homework.reviewTime && timenow <= homework.endTime) {
    return true;
  } else if (user.role === 1 && timenow >= homework.endTime && homework.status === 0) {
    return true;
  } else if (user.role === 2 && homework.status === 1) {
    return true;
  } else {
    return false;
  }
}

module.exports = router;
