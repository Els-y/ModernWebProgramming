var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('layout');
});

router.get('/templates/:name', function(req, res, next) {
  var name = req.params.name;
  res.render('templates/' + name);
});

module.exports = router;

// var Promise = require('bluebird');
// var path = require('path');

// var multer = require('multer');
// var settings = require('../modules/settings');

/* GET home page. */
// var upload = multer({dest: settings.uploadsPath});
// var storage = multer.diskStorage({
//   //设置上传后文件路径
//   destination: function (req, file, cb) {
//     cb(null, settings.uploadsPath);
//   },
//   //给上传文件重命名，获取添加后缀名
//   filename: function (req, file, cb) {
//     var fileFormat = (file.originalname).split(".");
//     cb(null, file.fieldname + '-' + req.session.user.name + "." + fileFormat[fileFormat.length - 1]);
//   }
// });
//  //添加配置文件到multer对象。
// var upload = multer({
//   storage: storage
// });
//
// var uploadZoneFile = upload.fields([
//   {
//     name: 'code',
//     maxCount: 1
//   },
//   {
//     name: 'image',
//     maxCount: 1
//   }
// ]);



// router.post('/upload', uploadZoneFile, function(req, res, next) {
//   console.log(req.files);
//   return res.json(req.files);
// });
