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
    {
      group: 4,
      student: 3
    },
    {
      group: 3,
      student: 3
    },
    {
      group: 3,
      student: 3
    }
  ],
  uploadsPath: 'uploads/'
};
