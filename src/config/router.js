const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  app.get('/', (req, res) => res.status(200).send(new Date()));

  const protectedRouter = express.Router();

  protectedRouter.use('/users', app.routes.users);
  protectedRouter.use('/lists', app.routes.lists);
  protectedRouter.use('/products', app.routes.products);

  app.use('/v1', app.config.passport.authenticate(), protectedRouter);
}