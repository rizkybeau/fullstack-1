const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; //token terizi gak>
    // console.log('my token auth : ' + token);
    try {
      if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      //anda tidak berhak - kalau tidak ada token
      res.status(500).json({ msg: error });
    }
  } else {
    throw new Error('token tidak masuk kedalam header. cek kembali!');
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== 'admin') {
    throw new Error('You are not an admin');
  } else {
    next();
  }
});
module.exports = { authMiddleware, isAdmin };
