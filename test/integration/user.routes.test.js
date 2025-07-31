const request = require('supertest');
const express = require('express');
const session = require('express-session');
const userRoutes = require('../../src/routes/user.routes');
// Mock del servicio de usuarios
jest.mock('../../src/services/userService');

describe('User Routes Integration', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use(
      session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use('/users', userRoutes);
  });

  describe('GET /users', () => {
    it('debería denegar acceso si no está autenticado', async () => {
      const response = await request(app).get('/users').send().expect(401);

      expect(response.body).toEqual({ error: 'No autenticado' });
    });
  });

  describe('GET /users/:id', () => {
    it('debería denegar acceso si no está autenticado', async () => {
      const response = await request(app).get('/users/1').send().expect(401);

      expect(response.body).toEqual({ error: 'No autenticado' });
    });
  });

  describe('PUT /users/:id', () => {
    it('debería denegar acceso si no está autenticado', async () => {
      const response = await request(app)
        .put('/users/1')
        .send({ email: 'newemail@example.com' })
        .expect(401);

      expect(response.body).toEqual({ error: 'No autenticado' });
    });
  });

  describe('DELETE /users/:id', () => {
    it('debería denegar acceso si no está autenticado', async () => {
      const response = await request(app).delete('/users/1').send().expect(401);

      expect(response.body).toEqual({ error: 'No autenticado' });
    });
  });
});
