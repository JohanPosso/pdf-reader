const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authRoutes = require('../../src/routes/auth.routes');
const userService = require('../../src/services/userService');

// Mock del servicio de usuarios
jest.mock('../../src/services/userService');

describe('Auth Routes Integration', () => {
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
    app.use('/auth', authRoutes);
  });

  describe('POST /auth/register', () => {
    it('debería registrar un usuario exitosamente', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: 1, email: userData.email };

      userService.registerUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(userService.registerUser).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(response.body).toEqual({
        message: 'Usuario registrado',
        user: { id: mockUser.id, email: mockUser.email },
      });
    });

    it('debería manejar errores durante el registro', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const errorMessage = 'El usuario ya existe';

      userService.registerUser.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(userService.registerUser).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(response.body).toEqual({ error: errorMessage });
    });

    it('debería validar que se envíen email y password', async () => {
      const userData = { email: 'test@example.com' }; // Sin password

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('debería hacer login exitosamente con credenciales válidas', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: 1, email: userData.email };

      userService.getUserByEmail.mockResolvedValue(mockUser);
      userService.checkUserPassword.mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/login')
        .send(userData)
        .expect(200);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(userService.checkUserPassword).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(response.body).toEqual({
        message: 'Login exitoso',
        user: { id: mockUser.id, email: mockUser.email },
      });
    });

    it('debería fallar si el usuario no existe', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      userService.getUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send(userData)
        .expect(401);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(response.body).toEqual({ error: 'Credenciales inválidas' });
    });

    it('debería fallar si la contraseña es incorrecta', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: 1, email: userData.email };

      userService.getUserByEmail.mockResolvedValue(mockUser);
      userService.checkUserPassword.mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send(userData)
        .expect(401);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(userService.checkUserPassword).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(response.body).toEqual({ error: 'Credenciales inválidas' });
    });
  });

  describe('POST /auth/logout', () => {
    it('debería hacer logout exitosamente', async () => {
      const response = await request(app).post('/auth/logout').expect(200);

      expect(response.body).toEqual({ message: 'Logout exitoso' });
    });
  });
});
