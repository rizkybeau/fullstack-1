const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  updatedUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require('../controller/userController');
const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

//kalau di laravel ini endpoint sama function pada folder route
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/forgot-password-token', forgotPasswordToken);
router.get('/all-users', getallUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getaUser); //<--
router.put('/password', authMiddleware, updatePassword);
router.put('/reset-password/:token', resetPassword);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser); //<--
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser); //<--
router.put('/edit-user', authMiddleware, updatedUser);
router.delete('/:id', deleteUser);

module.exports = router;
