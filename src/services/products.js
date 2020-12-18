const ValidationError = require('../errors/validationError');
const supertest = require('supertest');

module.exports = (app) => {
  const find = (filter = {}) => app.db('products').where(filter).first().select('id');

  const save = async (prod) => {
    const test = await supertest('http://challenge-api.luizalabs.com/').get(`api/product/${prod.product_id}/`);
    if (test.body.code) throw new ValidationError('Produto não encontrado!');

    const prodDb = await find({ list_id: prod.list_id, product_id: prod.product_id });

    if (prodDb) throw new ValidationError('A lista já contém o produto!');

    prod.date = new Date();

    return app.db('products').insert(prod, ['product_id', 'list_id'])
  }

  const remove = id => app.db('products').where({ id }).del();

  return { save, find, remove }
}