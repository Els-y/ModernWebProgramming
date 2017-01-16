var express = require('express');
var router = express.Router();

var Promise = require('bluebird');
var _ = require('lodash');

var Post = require('../models/post');
var Comment = require('../models/comment');

// GET
router.get('/', function (req, res) {
  var resJSON = {
    success: false,
    posts: [],
    user: {
      username: 'guest',
      logined: false
    }
  };
  Post.find().sort({'time': 'desc'}).populate('author').exec().then(function(posts) {
    posts.forEach(function(post, i) {
      resJSON.posts.push({
        id: post._id,
        title: post.title,
        text: post.text.substr(0, 50) + '...',
        author: post.author.username,
        time: post.time
      });
    });
    if (req.session.user) {
      resJSON.user.logined = true;
      resJSON.user.username = req.session.user.username;
    }
    resJSON.success = true;
  }).finally(function() {
    res.json(resJSON);
  });
});

router.get('/get/:id', function (req, res) {
  var id = req.params.id;
  var resJSON = {
    success: false,
    post: {}
  };
  Post.findById(id).populate([
    {path: 'author'},
    {path: 'comments', populate: {path: 'author'}}]).exec().then(function(post) {
    if (post) {
      resJSON.success = true;
      resJSON.post = {
        id: post._id,
        title: post.title,
        author: post.author.username,
        text: post.text,
        time: post.time,
        comments: []
      };
      // post.comments = _.sortBy(post.comments, 'time');
      post.comments.forEach(function(comment, i) {
        resJSON.post.comments.push({
          id: comment._id,
          author: comment.author.username,
          content: comment.content,
          time: comment.time
        });
      });
    }
  }).finally(function() {
    res.json(resJSON);
  });
});

// POST
router.post('/add', function (req, res) {
  var newPost;
  var postData = {
    title: req.body.title,
    author: req.session.user,
    text: req.body.text,
    time: new Date().toISOString()
  };
  var resJSON = {
    success: false,
    post: {}
  };

  if (!req.session.user) {
    res.json(resJSON);
  } else {
    newPost = new Post(postData);
    newPost.save().then(function(post) {
      resJSON.success = true;
      resJSON.post = {
        id: post._id,
        title: post.title,
        author: post.author.username,
        text: post.text,
        time: post.time
      };
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
  Post.findById(id).populate('author').exec().then(function(post) {
    if (post && post.author.username === req.session.user.username) {
      post.time = new Date().toISOString();
      post.title = req.body.title;
      post.text = req.body.text;
      return post.save();
    } else {
      return Promise.reject();
    }
  }).then(function(post) {
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
  Post.findById(id).populate('author').exec().then(function(post) {
    if (post && post.author.username === req.session.user.username) {
      return Promise.all([post.remove(), Comment.remove({post: post})]);
    } else {
      return Promise.reject();
    }
  }).then(function(post) {
    resJSON.success = true;
  }).finally(function() {
    res.json(resJSON);
  });
});

module.exports = router;
