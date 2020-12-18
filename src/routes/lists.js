const ValidationError = require('../errors/recursoIndevidoError')
const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', (req, res, next) => {
    app.services.list.findOne({ id: req.params.id })
      .then((l) => {
        if (l.user_id != req.user.id) throw new ValidationError('Recurso Inválido')
        else next();
      }).catch(err => next(err));
  });

  router.get('/', (req, res, next) => {
    app.services.list.find()
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  return router;
}