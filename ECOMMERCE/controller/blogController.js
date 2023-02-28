const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');
//create status - post - create - req.body
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newPost = await Blog.create(req.body);
    res.json(newPost);
  } catch (error) {
    throw new Error(error);
  }
  //   res.send('test');
});
//edit - put - req body - findAndUpdate
const editBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const edit = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json(edit);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get with id - req.params - findOne
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  // const viewbyid = await Blog.findById(id);
  try {
    if (id === null) {
      throw new Error('tidak ada id');
    }
    const getaBlog = await Blog.findById(id)
      .populate('likes')
      .populate('dislikes');
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    console.log(getaBlog);
    res.json(updateViews);
  } catch (error) {
    throw new Error(error);
  }
});

//get all - find()
const viewAllBlog = asyncHandler(async (req, res) => {
  try {
    const beranda = await Blog.find();
    res.json(beranda);
  } catch (error) {
    throw new Error('gagal memuat...');
  }
});
//advanced topics

const likeBlog = asyncHandler(async (req, res) => {
  const { postID } = req.body;
  console.log('MY POST ID: ' + postID);
  validateMongoDbId(postID);
  const blog = await Blog.findById(postID);
  console.log('database = ' + blog);
  const loginUserId = req?.user?._id;
  console.log('user = ' + loginUserId);
  const isLiked = blog?.isLiked;
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId.toString() === loginUserId?.toString()
  );
  console.log('ready = ' + alreadyDisliked);
  console.log('isLiked?' + isLiked);
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      postID,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      postID,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    console.log('likse: ' + blog.likes);
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      postID,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
const dislikeBlog = asyncHandler(async (req, res) => {
  const { postID } = req.body;
  console.log('MY POST ID: ' + postID);
  validateMongoDbId(postID);

  const blog = await Blog.findById(postID);
  //cek user Login
  const loginUserId = req?.user?._id;
  //cari user apakah sudah like postingan ini?
  const isDisliked = blog?.isDisliked;
  //cari user ini apakah like postingan?
  const alreadyliked = blog?.likes?.find(
    (userId) => userId.toString() === loginUserId?.toString()
  );
  //jika membatalkan suka - suka jadi batal suka
  if (alreadyliked) {
    const blog = await Blog.findByIdAndUpdate(
      postID,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  //jika batal tidak suka - gajadi dislikes
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      postID,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      postID,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

module.exports = {
  createBlog,
  editBlog,
  viewAllBlog,
  getBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
