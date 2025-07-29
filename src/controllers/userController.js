const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../services/userService');

async function listUsers(req, res) {
  const users = await getAllUsers();
  res.json(users);
}

async function getUser(req, res) {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ id: user.id, email: user.email });
}

async function updateUserCtrl(req, res) {
  const { id } = req.params;
  try {
    const user = await updateUser(id, req.body);
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteUserCtrl(req, res) {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { listUsers, getUser, updateUserCtrl, deleteUserCtrl };
