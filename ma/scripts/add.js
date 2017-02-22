let fs = require('fs');
let readline = require('readline');
let mongoose = require('mongoose');
let Promise = require('bluebird');
let settings = require('../modules/settings');
let User = require('../models/user');

mongoose.Promise = require('bluebird');
mongoose.connect(settings.database.url);

const file = './scripts/users.csv';
let arr = [];

let addUser = (infoArr) => {
  var user = new User({
    stuid: infoArr[0],
    password: infoArr[1],
    name: infoArr[2],
    class: Number(infoArr[3]),
    group: Number(infoArr[4]),
    role: Number(infoArr[5])
  });
  user.encryptPassword();
  arr.push(user.save());
}

let rStream = fs.createReadStream(file);
let rl = readline.createInterface({
   input: rStream,
});

rl.on('line', (input) => {
  let infoArr = input.split(',');
  console.log('正在添加: ', infoArr);
  addUser(infoArr);
});

rl.on('close', () => {
  Promise.all(arr).then(function() {
    console.log('添加用户成功');
  }).catch(function() {
    console.log('添加用户失败');
  }).finally(function() {
    mongoose.disconnect();
  });
});
