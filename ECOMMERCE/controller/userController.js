const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwttoken');
const validateMongoDbId = require('../utils/validateMongoDbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');
const crypto = require('crypto');

//createUser Controller
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    res.json({
      msg: 'user already exist',
      success: false,
    });
  }
});
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error('Login terlebih dahulu untuk mendapatkan cookie');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('login terlebih dahulu');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
    if (err || user.id !== decode.id) {
      throw new Error(
        'jwt.verify - there is something wrong with refreshToken'
      );
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});
//loginUser Controller masukkan email dan pass - cocokan - masuk
const loginUserCtrl = asyncHandler(async function (req, res) {
  const { email, password } = req.body;
  //check users sudah login?
  //ID or password is not valid.

  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const varrefreshToken = generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: varrefreshToken },
      { new: true }
    );
    res.cookie('refreshToken', varrefreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    //spill akun profil
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error('ID or password is not valid.');
  }
});
const loginAdmin = asyncHandler(async function (req, res) {
  const { email, password } = req.body;
  //check users sudah login?
  //ID or password is not valid.

  const findAdmin = await User.findOne({ email });

  if (findAdmin.role !== 'admin') throw new Error('tidak diizinkan');
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const varrefreshToken = generateRefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      { refreshToken: varrefreshToken },
      { new: true }
    );
    res.cookie('refreshToken', varrefreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    //spill akun profil
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error('ID or password is not valid.');
  }
});
//Logout Controller - hapus token
const logout = asyncHandler(async (req, res) => {
  //code here - logic here: periksa token,periksa user-updatebahwauser logout
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error('Logout - tidak ada token di cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //Forbidden
  }
  await User.findOneAndUpdate(refreshToken, { refreshToken: ' ' });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); //Forbidden
});

//getUser Controller
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

//get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUser = await User.findById(id);
    if (!getUser) {
      return res.status(404).json({ msg: 'data yang dicari tidak ada' });
    }
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});
//update a user
const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );

    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});
//delete a users
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    throw new Error('id tidak ditemukan');
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({ msg: 'user Unblocked' });
  } catch (error) {
    throw new Error(error);
  }
});
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({ msg: 'user blocked' });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user; //id user yg mau di update
    const { password } = req.body; //passwrod baru yg di input
    validateMongoDbId(_id);

    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatePassword = await user.save();
      res.json(updatePassword);
    } else {
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//forgot password
const forgotPasswordToken = asyncHandler(async (req, res, data) => {
  //input email and cari data berdasarkan email
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) throw new Error('user dengan email ini tidak ditemukan');
  try {
    console.log(user);
    //proccess
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `link untuk reset password anda: <a href="http://localhost:5000/api/user/reset-password/${token}">click here</a>`;
    const data = {
      to: email,
      text: 'tentang reset password anda',
      subject: 'ini link untuk reset password anda',
      htm: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error('gagal');
  }
});
//reset password setelah forgot = reset and new password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  console.log(hashedToken);
  //sampai sini masih bug
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });
  console.log('reset password function - ' + user);
  if (!user) throw new Error('Token expired, please try again');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  res.json(user);
});

module.exports = {
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
  loginAdmin,
};
