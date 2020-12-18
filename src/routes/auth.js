const express = require('express');
const jwt = require('jwt-simple');
const ValidationError = require('../errors/validationError');

const secret = process.env.SECRET;

module.exports = (app) => {
  const router = express.Router();

  router.post('/sigin', (req, res, next) => {
    app.services.user.findOne({ mail: req.body.mail })
      .then((user) => {
        if (!user) throw new ValidationError('Usuário inválido');

        const payload = {
          id: user.id,
          name: user.name,
          mail: user.mail
        }

        const token = jwt.encode(payload, secret);

        res.status(200).json({ token });
      }).catch(err => next(err));
  })

  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  return router;
}
