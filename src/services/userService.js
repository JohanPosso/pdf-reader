const User = require('../models/user');
const bcrypt = require('bcrypt');

async function registerUser(email, password) {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error('El usuario ya existe');
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  return user;
}

async function getUserByEmail(email) {
  return User.findOne({ where: { email } });
}

async function checkUserPassword(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) return false;
  return bcrypt.compare(password, user.password);
}

async function getUserById(id) {
  return User.findByPk(id);
}

async function getAllUsers() {
  return User.findAll({ attributes: { exclude: ['password'] } });
}

async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuario no encontrado');
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  await user.update(data);
  return user;
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuario no encontrado');
  await user.destroy();
  return true;
}

module.exports = {
  registerUser,
  getUserByEmail,
  checkUserPassword,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
