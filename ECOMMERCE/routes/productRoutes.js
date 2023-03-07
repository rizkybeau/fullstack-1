const express = require('express');
const {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  addtoWishList,
  rating,
  uploadImages,
} = require('../controller/productController');
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware');
const { uploadPhoto, productImgRezise } = require('../middleware/uploadImages');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/:id', getProductById);
router.get('/', getProducts);
router.put('/wishlist', authMiddleware, addtoWishList);
router.put('/rating', authMiddleware, rating);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.put(
  '/upload/:id',
  authMiddleware,
  isAdmin,
  uploadPhoto.array('images', 10),
  productImgRezise,
  uploadImages
);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
