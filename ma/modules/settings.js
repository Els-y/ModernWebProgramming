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
      id: 1,
      group: 1,
      student: 3
    },
    {
      id: 2,
      group: 3,
      student: 3
    },
    {
      id: 3,
      group: 3,
      student: 3
    }
  ],
  uploadsPath: 'uploads/'
};
