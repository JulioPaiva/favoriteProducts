const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  //app.use('/', (req, res) => res.status(200).send(new Date()));

  const protectedRouter = express.Router();

  protectedRouter.use('/users', app.routes.users);
  protectedRouter.use('/products', app.routes.products);

  app.use('/v1', app.config.passport.authenticate(), protectedRouter);
}