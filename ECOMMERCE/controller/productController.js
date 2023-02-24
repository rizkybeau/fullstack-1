const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const { default: slugify } = require('slugify');

//create product (CREATE)
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const insertProduct = await Product.create(req.body);

    res.json(insertProduct);
  } catch (error) {
    throw new Error('gagal create product periksa schema');
  }
});
//get a product
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const getProductById = await Product.findById(id);
    res.json(getProductById);
  } catch (error) {
    throw new Error('error get product');
  }
});

//get all products
const getProducts = asyncHandler(async (req, res) => {
  try {
    //Fillter Harga
    const queryObj = { ...req.query };
    const excludeField = ['page', 'sort', 'limit', 'fields'];

    excludeField.forEach((el) => delete queryObj[el]);
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    //greater than equals >= | greater than > | less than equals <= | less than <
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // Sorting - menampilkan berdasarkan brand only / category only
    if (req.query.sort) {
      console.log('query: ' + req.query.sort);
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Limiting the fields - menampilkan beberapa fields saja di postman
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //Pagination styles - menampilkan limit product page 1-3,2-3,3-3. 3item/hal
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount)
        throw new Error('page tidak boleh lebih dari limits (page4 of 3limit)');
    }
    console.log(page, limit, skip);

    const getAllProduct = await query;
    res.json(getAllProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//update Product (UPDATE)
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; //id dimasukkan
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    //update berdasarkan id kalau tidak ada idnya bakal null
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error('Error update product - check kembali syntax');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  //delete by id product
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json({ deleteProduct });
  } catch (error) {
    throw new Error('error delete - id tidak ditemukan');
  }
  res.json({ msg: 'success' });
});

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
