const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail']);
  }

  const findOne = async (filter = {}) => {
    let user = await app.db('users').where(filter).first();

    user.products = await app.db('products').where({ user_id: user.id }).select('id', 'product_id');

    return user;
  };

  const save = async (user) => {
    if (!user.name) throw new ValidationError('Nome é um atributo obrigatório!');
    if (user.name.length > 100) throw new ValidationError('Nome deve conter no máximo 100 caracteres!');

    if (!user.mail) throw new ValidationError('E-mail é um atributo obrigatório!');
    if (user.mail.length > 100) throw new ValidationError('E-mail deve conter no máximo 100 caracteres!');

    const userDb = await findOne({ mail: user.mail });

    if (userDb) throw new ValidationError('Já existe um usuário com este email!');

    return app.db('users').insert(user, ['id', 'name', 'mail'])
  }

  const update = async (id, user) => {
    if (!user.name) throw new ValidationError('Nome é um atributo obrigatório!');
    if (user.name.length > 100) throw new ValidationError('Nome deve conter no máximo 100 caracteres!');

    if (!user.mail) throw new ValidationError('E-mail é um atributo obrigatório!');
    if (user.mail.length > 100) throw new ValidationError('E-mail deve conter no máximo 100 caracteres!');

    const userDb = await findOne({ mail: user.mail });

    if (userDb && userDb.id === id) throw new ValidationError('Já existe um usuário com este email!');

    return app.db('users').where({ id }).update(user, '*')
  }

  const remove = id => app.db('users').where({ id }).del();

  return { findAll, findOne, save, update, remove }
}