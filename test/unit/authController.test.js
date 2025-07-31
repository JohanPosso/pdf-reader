const {
  register,
  login,
  logout,
} = require('../../src/controllers/authController');
const userService = require('../../src/services/userService');

// Mock del servicio de usuarios
jest.mock('../../src/services/userService');

describe('AuthController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      session: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
  });

  describe('register', () => {
    it('debería registrar un usuario exitosamente', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: 1, email: userData.email };

      mockReq.body = userData;
      userService.registerUser.mockResolvedValue(mockUser);

      await register(mockReq, mockRes);

      expect(userService.registerUser).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(mockReq.session.userId).toBe(mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
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

      mockReq.body = userData;
      userService.registerUser.mockRejectedValue(new Error(errorMessage));

      await register(mockReq, mockRes);

      expect(userService.registerUser).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('login', () => {
    it('debería hacer login exitosamente con credenciales válidas', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: 1, email: userData.email };

      mockReq.body = userData;
      userService.getUserByEmail.mockResolvedValue(mockUser);
      userService.checkUserPassword.mockResolvedValue(true);

      await login(mockReq, mockRes);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(userService.checkUserPassword).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(mockReq.session.userId).toBe(mockUser.id);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login exitoso',
        user: { id: mockUser.id, email: mockUser.email },
      });
    });

    it('debería fallar si el usuario no existe', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockReq.body = userData;
      userService.getUserByEmail.mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Credenciales inválidas',
      });
    });

    it('debería fallar si la contraseña es incorrecta', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: 1, email: userData.email };

      mockReq.body = userData;
      userService.getUserByEmail.mockResolvedValue(mockUser);
      userService.checkUserPassword.mockResolvedValue(false);

      await login(mockReq, mockRes);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(userService.checkUserPassword).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Credenciales inválidas',
      });
    });
  });

  describe('logout', () => {
    it('debería hacer logout exitosamente', () => {
      mockReq.session.destroy = jest.fn((callback) => callback());

      logout(mockReq, mockRes);

      expect(mockReq.session.destroy).toHaveBeenCalled();
      expect(mockRes.clearCookie).toHaveBeenCalledWith('connect.sid');
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Logout exitoso!' });
    });
  });
});
