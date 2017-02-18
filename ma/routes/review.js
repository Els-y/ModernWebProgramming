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
  }).exec().
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
      uploads: []
    }
  };

  if (!req.session.user ||
      !req.query.homework) return res.json(resJson);

  Homework.findById(req.query.homework).exec().
    then(function(homework) {
      if (homework) {
        resJson.data.maxScore = homework.maxScore;
        return Promise.resolve(homework);
      } else {
        return Promise.reject();
      }
    }).then(function(homework) {
      return Promise.all([
        Upload.find({
          homework: homework._id,
          group: homework.reviewGroup[req.session.user.group - 1]
        }).populate({path: 'author', select: '-password'}).exec(),
        Review.find({
          homework: homework._id,
          from: req.session.user._id,
        }).exec()
      ]);
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
  };

  Homework.findById(req.body.homework).exec().
    then(function(homework) {
      if (homework) {
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
    }).finally(function() {
      res.json(resJson);
    });
});

function checkScoreValid(homework, score) {
  return score >= 0 && score <= homework.maxScore;
}

module.exports = router;
