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
    app.services.list.findAll()
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.list.findOne({ 'lists.id': req.params.id })
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.post('/', (req, res, next) => {
    app.services.list.save(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.list.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  });

  return router;
}