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
  uploadsPath: 'uploads/'
};
