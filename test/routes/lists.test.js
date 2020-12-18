const supertest = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/lists';
let user, list;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User List', mail: `${Date.now()}@mail.com` });
  user = { ...res[0] };
  user.token = jwt.encode(user, process.env.SECRET);

  const res2 = await app.services.list.save({ user_id: user.id, date: `${new Date()}` });
  list = { ...res2[0] };
});

test('Devo listar todas as listas', () => {
  return supertest(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0)
    })
});

test('Devo retornar uma lista por id', () => {
  return supertest(app).get(`${MAIN_ROUTE}/${list.id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => expect(res.status).toBe(200));
});

test.skip('Devo salvar uma lista', () => {
  return app.db('users').insert({ name: 'User List', mail: `${Date.now()}@mail.com` }, ['id'])
    .then((user3 => supertest(app).post(MAIN_ROUTE)
      .send({ user_id: user3.id })
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
      })));
});

test('Não deve adicionar uma lista a um usuário com lista', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Este usuário já possui uma lista!');
    });
});

test('Deve remover uma lista', () => {
  return supertest(app).delete(`${MAIN_ROUTE}/${list.id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test.skip('Não deve acessar lista de outro usuário', () => {
  return app.db('users')
    .insert({ name: 'User #2', mail: `${Date.now()}@mail.com` }, ['id'])
    .then((res) => supertest(app).get(`${MAIN_ROUTE}/${res[0].id}`))
    .then((res) => expect(res.status).toBe(200));
});