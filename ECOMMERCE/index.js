const { errorHandler, notFound } = require('./middleware/errorHandler');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes'); //<
const koneksi = require('./config/dbconnect');
const express = require('express');
const cookieParser = require('cookie-parser');
const { generateRefreshToken } = require('./config/RefreshToken');
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
app.use('/api/product', productRouter); //<
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server berhasil dengan portnya localhost://${PORT}`);
});
