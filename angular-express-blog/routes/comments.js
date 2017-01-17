var express = require('express');
var router = express.Router();

var Promise = require('bluebird');
var _ = require('lodash');

var Post = require('../models/post');
var Comment = require('../models/comment');

// GET
router.get('/get/:id', function(req, res) {
  var id = req.params.id;
  var resJSON = {
    success: false,
    comment: {}
  };
  Comment.findById(id).populate('author').exec().then(function(comment) {
    if (comment) {
      resJSON.success = true;
      resJSON.comment = {
        id: comment._id,
        author: comment.author.username,
        content: comment.hide && (!req.session.user || req.session.user.role === 1 || req.session.user.username !== comment.author.username) ? 'This content has been hidden by the administrator' : comment.content,
        hide: comment.hide
      };
    }
  }).finally(function() {
    res.json(resJSON);
  });
});

router.get('/getbypost/:id', function(req, res) {
  var id = req.params.id;
  var resJSON = {
    success: false,
    comments: []
  };
  var populateParams = [
    {
      path: 'comments',
      populate: 'author'
    }
  ];
  Post.findById(id).populate({path: 'comments', populate: {path: 'author'}}).exec().then(function(post) {
    if (post) {
      post.comments.forEach(function(comment, i) {
        console.log(comment);
        resJSON.comments.push({
          id: comment._id,
          author: comment.author.username,
          content: comment.hide && (!req.session.user || req.session.user.role === 1 || req.session.user.username !== comment.author.username) ? 'This content has been hidden by the administrator' : comment.content,
          time: comment.time,
          hide: comment.hide
        });
      });
      console.log(resJSON.comments);
      resJSON.success = true;
    }
  }).finally(function() {
    res.json(resJSON);
  });
});

// POST
router.post('/add', function (req, res) {
  var newComment;
  var resJSON = {
    success: false,
    comment: {}
  };

  if (!req.session.user) {
    res.json(resJSON);
  } else {
    Post.findById(req.body.post).exec().then(function(post) {
      if (post) return Promise.resolve(post);
      else return Promise.reject();
    }).then(function(post) {
      var comment = new Comment({
        post: post,
        author: req.session.user,
        content: req.body.content,
        time: new Date().toISOString(),
        hide: false
      });
      return Promise.all([comment.save(), post]);
    }).spread(function(comment, post) {
      post.comments.push(comment);
      resJSON.comment = {
        id: comment._id,
        author: comment.author.username,
        content: comment.content,
        time: comment.time
      };
      return post.save();
    }).then(function(post) {
      resJSON.success = true;
    }).finally(function() {
      res.json(resJSON);
    });
  }
});

// PUT
router.put('/edit/:id', function (req, res) {
  var id = req.params.id;
  var resJSON = {
    success: false,
  };
  if (!req.session.user) return res.json(resJSON);
  Comment.findById(id).populate('author').exec().then(function(comment) {
    if (comment && comment.author.username === req.session.user.username) {
      comment.content = req.body.content;
      return comment.save();
    } else {
      return Promise.reject();
    }
  }).then(function(comment) {
    resJSON.success = true;
  }).finally(function() {
    res.json(resJSON);
  });
});

router.put('/hide/:id', function (req, res) {
  var id = req.params.id;
  var resJSON = {
    success: false,
  };
  if (!req.session.user || req.session.user.role !== 1) return res.json(resJSON);
  Comment.findById(id).exec().then(function(comment) {
    if (comment) {
      comment.hide = true;
      return comment.save();
    } else {
      return Promise.reject();
    }
  }).then(function(comment) {
    resJSON.success = true;
  }).finally(function() {
    res.json(resJSON);
  });
});

router.put('/show/:id', function (req, res) {
  var id = req.params.id;
  var resJSON = {
    success: false,
  };
  if (!req.session.user || req.session.user.role !== 1) return res.json(resJSON);
  Comment.findById(id).exec().then(function(comment) {
    if (comment) {
      comment.hide = false;
      return comment.save();
    } else {
      return Promise.reject();
    }
  }).then(function(comment) {
    resJSON.success = true;
  }).finally(function() {
    res.json(resJSON);
  });
});

// DELETE
router.delete('/delete/:id', function (req, res) {
  var id = req.params.id;
  var resJSON = {
    success: false,
  };
  if (!req.session.user) return res.json(resJSON);
  Comment.findById(id).populate('post author').exec().then(function(comment) {
    console.log(comment);
    if (comment && comment.author.username === req.session.user.username) {
      return Promise.all([Post.update({comments: {$in: [comment._id]}}, {$pull: {'comments': comment._id}}).exec(), comment.remove()]);
    } else {
      return Promise.reject();
    }
  }).spread(function() {
    resJSON.success = true;
  }).finally(function() {
    res.json(resJSON);
  });
});


module.exports = router;
