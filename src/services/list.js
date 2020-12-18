const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = () => {
    return app.db('lists').select(['*']);
  }

  const findOne = async (filter) => {
    const list = await find(filter);

    list.products = await app.db('products').where({ 'list_id': list.id }).select(['*']);

    return list;
  };

  const find = (filter = {}) => {
    return app.db('lists').where(filter).first();
  };

  const save = async (list) => {
    if (!list.user_id) throw new ValidationError('Id do suário é um atributo obrigatório!');

    const listDb = await find({ user_id: list.user_id });

    if (listDb) throw new ValidationError('Este usuário já possui uma lista!');

    list.date = new Date();
    return app.db('lists').insert(list, ['id', 'user_id', 'date'])
  }

  const remove = id => app.db('lists').where({ id }).del();

  return { findAll, findOne, save, remove }
}