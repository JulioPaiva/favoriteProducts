const request = require('supertest');
const app = require('../../src/app');

test('Deve criar usuário via signup', () => request(app).post('/auth/signup')
  .send({ name: 'Sherlock', mail: `${Date.now()}@mail.com` })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Sherlock');
    expect(res.body).toHaveProperty('mail');
    expect(res.status).not.toHaveProperty('passwd');
  }));

test.skip('Deve receber token ao logar', () => {
  const mail = `${Date.now()}@mail.com`;

  return app.services.user.save(
    { name: 'Sherlock', mail },
  )
    .then(() => request(app).post('/auth/signin')
      .send({ mail }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test.skip('Não deve autenticar usuário não cadastrado', () => {
  return request(app).post('/auth/signin')
    .send({ mail: 'naoexiste@mail.com' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuário inválido.');
    });
});

test('Não deve acessar uma rota protegida sem token', () => request(app).get('/v1/users/')
  .then((res) => {
    expect(res.status).toBe(401);
  }));
