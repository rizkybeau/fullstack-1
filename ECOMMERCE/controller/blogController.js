const blogModel = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const createBlog = asyncHandler(async (req, res) => {
  res.send('oke');
});

module.exports = createBlog;
