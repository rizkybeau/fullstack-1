const express = require('express');
const {
  createBlog,
  editBlog,
  viewAllBlog,
  getBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require('../controller/blogController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, dislikeBlog);
router.put('/:id', authMiddleware, isAdmin, editBlog);

router.get('/', viewAllBlog);
router.get('/:id', getBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);

module.exports = router;
