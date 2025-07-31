const {
  registerUser,
  checkUserPassword,
  getUserByEmail,
} = require('../services/userService');

async function register(req, res) {
  const { email, password } = req.body;
  try {
    const user = await registerUser(email, password);
    req.session.userId = user.id;
    res.status(201).json({
      message: 'Usuario registrado',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const valid = await checkUserPassword(email, password);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  req.session.userId = user.id;
  res.json({
    message: 'Login exitoso',
    user: { id: user.id, email: user.email },
  });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout exitoso!' });
  });
}

module.exports = { register, login, logout };
