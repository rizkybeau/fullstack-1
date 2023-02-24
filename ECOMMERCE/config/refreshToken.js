const jwtToken = require('jsonwebtoken');

const generateRefreshToken = (id) => {
  return jwtToken.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

module.exports = { generateRefreshToken };
