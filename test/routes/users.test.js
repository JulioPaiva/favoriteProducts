const supertest = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/users';

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User', mail: `${Date.now()}@mail.com` });
  user = { ...res[0] };
  user.token = jwt.encode(user, process.env.SECRET);
});

test('Devo listar todos os usuários', () => {
  return app.db('users').insert(
    { name: 'user', mail: `${Date.now()}@mail.com` }
  ).then(() => supertest(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0)
    })
});

test('Devo listar usuário por Id', () => {
  return supertest(app).get(`${MAIN_ROUTE}/${user.id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('User');
    });
});

test('Devo inserir um usuário com sucesso', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ name: 'user', mail: `${Date.now()}@mail.com` })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('user');
    })
});

test('Não deve inserir usuário sem nome', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ mail: `${Date.now()}@mail.com` })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório!');
    });
});

test('Não deve inserir usuário sem email', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ name: 'user' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('E-mail é um atributo obrigatório!');
    });
});

test('Não deve aceitar nomes com mais de 100 caracteres', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ name: 'João Guilherme Mateus José Augusto Antônio Ricardo Henrique Gustavo da Silva Souza Pimenta de Alencar', mail: `${Date.now()}@mail.com` })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome deve conter no máximo 100 caracteres!');
    });
});

test('Não deve aceitar e-mail com mais de 100 caracteres', () => {
  return supertest(app).post(MAIN_ROUTE)
    .send({ name: 'user', mail: 'joao_guilherme_mateus_jose_augusto_antonio_ricardo_henrique_gustavo_da_silva_souza_pimenta_de_alencar@mail.com' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('E-mail deve conter no máximo 100 caracteres!');
    });
});

test('Não deve inserir usuário com e-mail existente', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.db('users').insert({ name: 'Júlio Paiva', mail })
    .then(() => supertest(app).post(MAIN_ROUTE)
      .send({ name: 'Júlio Paiva #2', mail })
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Já existe um usuário com este email!');
      }));
})

test('Deve alterar um usuário', () => {
  return supertest(app).put(`${MAIN_ROUTE}/${user.id}`)
    .send({ name: 'User Update', mail: `update_${Date.now()}@mail.com` })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('User Update');
    });
});

test('Deve remover um usuário', () => {
  return supertest(app).delete(`${MAIN_ROUTE}/${user.id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
}); 
