const supertest = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/products';
let user;
let list;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User List', mail: `${Date.now()}@mail.com` });
  user = { ...res[0] };
  user.token = jwt.encode(user, process.env.SECRET);

  const res2 = await app.services.list.save({ user_id: user.id, date: `${new Date()}` });
  list = { ...res2[0] }
});

test('Devo salvar produto em uma lista', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ list_id: list.id, product_id: 'ee9fc710-8876-c40c-7862-275e237d84a4' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
    });
});

test('Não devo salvar produto repetido', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ list_id: 35, product_id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A lista já contém o produto!');
    });
});

test('Não devo salvar produto inexistente', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ list_id: 35, product_id: '83ee6f6-c3af-3d63-4b1d-bb42d33692bf' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Produto não encontrado!');
    });
});

test('Deve remover um produto', () => {
  return app.db('products')
    .insert({ list_id: list.id, product_id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f', date: new Date() }, ['id'])
    .then((res) => supertest(app).delete(`${MAIN_ROUTE}/${res[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(204);
      }));
}); 