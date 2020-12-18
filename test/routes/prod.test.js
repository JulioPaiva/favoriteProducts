const supertest = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/products';
let user, id_prod;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User', mail: `${Date.now()}@mail.com` });
  user = { ...res[0] };
  user.token = jwt.encode(user, process.env.SECRET);

  id_prod = await supertest('http://challenge-api.luizalabs.com').get('/api/product/?page=1');
});

test('Devo salvar um produto', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ user_id: user.id, product_id: id_prod.body.products[0].id })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
    });
});

test('Não devo salvar produto repetido', () => {
  return app.db('products').insert({ user_id: user.id, product_id: id_prod.body.products[0].id })
    .then(() => supertest(app).post(MAIN_ROUTE)
      .send({ user_id: user.id, product_id: id_prod.body.products[0].id })
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A lista já contém o produto!');
    });
});

test('Não devo salvar produto inexistente', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ user_id: user.id, product_id: '83ee6f6-c3af-3d63-4b1d-bb42d33692bf' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Produto não encontrado!');
    });
});

test('Deve remover um produto', () => {
  return app.db('products')
    .insert({ user_id: user.id, product_id: id_prod.body.products[0].id }, ['id'])
    .then((res) => supertest(app).delete(`${MAIN_ROUTE}/${res[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(204);
      }));
}); 