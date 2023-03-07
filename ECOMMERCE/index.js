const { errorHandler, notFound } = require('./middleware/errorHandler');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const blogRouter = require('./routes/blogRoutes');
const cRouter = require('./routes/prodcategoryRoutes');
const blogcatRouter = require('./routes/blogcategoryRoutes');
const brandRouter = require('./routes/brandcategoryRoutes');
const couponRouter = require('./routes/couponRoutes');

const koneksi = require('./config/dbconnect');
const express = require('express');
const cookieParser = require('cookie-parser');

const morgan = require('morgan');
const app = express();
require('dotenv').config({ path: '.env' });
const PORT = process.env.PORT || 4000;
koneksi();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', cRouter);
app.use('/api/brandcategory', brandRouter);
app.use('/api/blogcategory', blogcatRouter);
app.use('/api/coupon', couponRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server berhasil dengan portnya localhost://${PORT}`);
});
