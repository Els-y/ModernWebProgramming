let fs = require('fs');
let readline = require('readline');
let path = require('path');
let basepath = './uploads';

let rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

rl.question("班级个数: ", (count)=>{
  if (!fs.existsSync(basepath)) {
    fs.mkdirSync(basepath);
  }
  for (var i = 1; i <= count; ++i) {
    var subpath = path.join(basepath, 'class' + i); 
    if (!fs.existsSync(subpath)) {
      fs.mkdirSync(subpath);
    }
  }
  console.log('创建文件夹完毕')
  rl.close();
});

rl.on("close", function(){
  process.exit(0);
});