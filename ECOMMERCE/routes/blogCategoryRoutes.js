const express = require('express');
const {
  createCategory,
  upCategory,
  delCategory,
  getCategory,
  allCategory,
} = require('../controller/blogCategoryController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, upCategory);
router.delete('/:id', authMiddleware, isAdmin, delCategory);
router.get('/:id', getCategory);
router.get('/', allCategory);

module.exports = router;
