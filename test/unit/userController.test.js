const {
  listUsers,
  getUser,
  updateUserCtrl,
  deleteUserCtrl,
} = require('../../src/controllers/userController');
const userService = require('../../src/services/userService');

// Mock del servicio de usuarios
jest.mock('../../src/services/userService');

describe('UserController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('listUsers', () => {
    it('debería retornar todos los usuarios', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      userService.getAllUsers.mockResolvedValue(mockUsers);

      await listUsers(mockReq, mockRes);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('getUser', () => {
    it('debería retornar un usuario específico', async () => {
      const userId = '1';
      const mockUser = { id: 1, email: 'test@example.com' };

      mockReq.params.id = userId;
      userService.getUserById.mockResolvedValue(mockUser);

      await getUser(mockReq, mockRes);

      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const userId = '999';

      mockReq.params.id = userId;
      userService.getUserById.mockResolvedValue(null);

      await getUser(mockReq, mockRes);

      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Usuario no encontrado',
      });
    });
  });

  describe('updateUserCtrl', () => {
    it('debería actualizar un usuario exitosamente', async () => {
      const userId = '1';
      const updateData = { email: 'newemail@example.com' };
      const mockUser = { id: 1, email: 'newemail@example.com' };

      mockReq.params.id = userId;
      mockReq.body = updateData;
      userService.updateUser.mockResolvedValue(mockUser);

      await updateUserCtrl(mockReq, mockRes);

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('debería manejar errores durante la actualización', async () => {
      const userId = '999';
      const updateData = { email: 'newemail@example.com' };
      const errorMessage = 'Usuario no encontrado';

      mockReq.params.id = userId;
      mockReq.body = updateData;
      userService.updateUser.mockRejectedValue(new Error(errorMessage));

      await updateUserCtrl(mockReq, mockRes);

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteUserCtrl', () => {
    it('debería eliminar un usuario exitosamente', async () => {
      const userId = '1';

      mockReq.params.id = userId;
      userService.deleteUser.mockResolvedValue(true);

      await deleteUserCtrl(mockReq, mockRes);

      expect(userService.deleteUser).toHaveBeenCalledWith(userId);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Usuario eliminado',
      });
    });

    it('debería manejar errores durante la eliminación', async () => {
      const userId = '999';
      const errorMessage = 'Usuario no encontrado';

      mockReq.params.id = userId;
      userService.deleteUser.mockRejectedValue(new Error(errorMessage));

      await deleteUserCtrl(mockReq, mockRes);

      expect(userService.deleteUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
