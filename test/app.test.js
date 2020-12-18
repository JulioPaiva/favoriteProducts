const supertest = require('supertest');

const app = require('../src/app');

test('Devo responder na raiz do projeto', () => {
  supertest(app).get('/')
    .then(res => expect(res.status).toBe(200));
}); 