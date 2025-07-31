const {
  registerUser,
  getUserByEmail,
  checkUserPassword,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../../src/services/userService');
const User = require('../../src/models/user');
const bcrypt = require('bcrypt');

// Mock de los módulos
jest.mock('../../src/models/user');
jest.mock('bcrypt');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('debería registrar un usuario exitosamente', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';
      const mockUser = { id: 1, email, password: hashedPassword };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(mockUser);

      const result = await registerUser(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(User.create).toHaveBeenCalledWith({
        email,
        password: hashedPassword,
      });
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar error si el usuario ya existe', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const existingUser = { id: 1, email };

      User.findOne.mockResolvedValue(existingUser);

      await expect(registerUser(email, password)).rejects.toThrow(
        'El usuario ya existe',
      );
      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('getUserByEmail', () => {
    it('debería retornar un usuario por email', async () => {
      const email = 'test@example.com';
      const mockUser = { id: 1, email };

      User.findOne.mockResolvedValue(mockUser);

      const result = await getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });

    it('debería retornar null si el usuario no existe', async () => {
      const email = 'test@example.com';

      User.findOne.mockResolvedValue(null);

      const result = await getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    });
  });

  describe('checkUserPassword', () => {
    it('debería retornar true para credenciales válidas', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { id: 1, email, password: 'hashedPassword' };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await checkUserPassword(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toBe(true);
    });

    it('debería retornar false si el usuario no existe', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      User.findOne.mockResolvedValue(null);

      const result = await checkUserPassword(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBe(false);
    });

    it('debería retornar false para credenciales inválidas', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { id: 1, email, password: 'hashedPassword' };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const result = await checkUserPassword(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('debería retornar un usuario por ID', async () => {
      const id = 1;
      const mockUser = { id, email: 'test@example.com' };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await getUserById(id);

      expect(User.findByPk).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('debería retornar todos los usuarios sin contraseñas', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      User.findAll.mockResolvedValue(mockUsers);

      const result = await getAllUsers();

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ['password'] },
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario exitosamente', async () => {
      const id = 1;
      const updateData = { email: 'newemail@example.com' };
      const mockUser = { id, email: 'oldemail@example.com', update: jest.fn() };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await updateUser(id, updateData);

      expect(User.findByPk).toHaveBeenCalledWith(id);
      expect(mockUser.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockUser);
    });

    it('debería hashear la contraseña si se incluye en los datos', async () => {
      const id = 1;
      const updateData = { password: 'newpassword123' };
      const hashedPassword = 'hashedNewPassword';
      const mockUser = { id, email: 'test@example.com', update: jest.fn() };

      User.findByPk.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue(hashedPassword);

      await updateUser(id, updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockUser.update).toHaveBeenCalledWith({
        password: hashedPassword,
      });
    });

    it('debería lanzar error si el usuario no existe', async () => {
      const id = 1;
      const updateData = { email: 'newemail@example.com' };

      User.findByPk.mockResolvedValue(null);

      await expect(updateUser(id, updateData)).rejects.toThrow(
        'Usuario no encontrado',
      );
      expect(User.findByPk).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario exitosamente', async () => {
      const id = 1;
      const mockUser = { id, email: 'test@example.com', destroy: jest.fn() };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await deleteUser(id);

      expect(User.findByPk).toHaveBeenCalledWith(id);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debería lanzar error si el usuario no existe', async () => {
      const id = 1;

      User.findByPk.mockResolvedValue(null);

      await expect(deleteUser(id)).rejects.toThrow('Usuario no encontrado');
      expect(User.findByPk).toHaveBeenCalledWith(id);
    });
  });
});
