const express = require('express');
const router = express.Router();
const {
  listUsers,
  getUser,
  updateUserCtrl,
  deleteUserCtrl,
} = require('../controllers/userController');
const { requireAuth } = require('../middlewares/auth');

router.get('/', requireAuth, listUsers);
router.get('/:id', requireAuth, getUser);
router.put('/:id', requireAuth, updateUserCtrl);
router.delete('/:id', requireAuth, deleteUserCtrl);

module.exports = router;
