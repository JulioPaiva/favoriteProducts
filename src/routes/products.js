const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    app.services.products.save(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err));
  });

  router.get('/', (req, res, next) => {
    app.services.products.find(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.products.remove(req.params.id)
      .then(result => res.status(204).json(result[0]))
      .catch(err => next(err));
  });

  return router;
}