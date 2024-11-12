// src/tests/user.test.js
const request = require('supertest');
const app = require('../index');

describe('POST /users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@example.com', password: '123456' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('email', 'johndoe@example.com');
  });
});
