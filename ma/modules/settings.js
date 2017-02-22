module.exports = {
  session: {
    secret: 'myachievement',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
  },
  database: {
    url: 'mongodb://localhost/ma'
  },
  classes: [
    // 配置每个班有多少小组, 数组中第一个为1班，第二个为2班，例如: 1班4组，2班3组
    // {
    //   group: 4,
    // },
    // {
    //   group: 3,
    // }
  ],
  uploadsPath: 'uploads/'
};
