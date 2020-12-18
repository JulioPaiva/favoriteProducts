const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');

require('dotenv').config();

app.db = knex(knexfile[process.env.NODE_ENV]);

consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middleware.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);

app.use((err, req, res, next) => {
  const { name, message } = err;

  if (name === 'ValidationError') res.status(400).json({ error: message });
  else if (name === 'RecursoIndevidoError') res.status(403).json({ error: message });

  next(err);
});

module.exports = app;
