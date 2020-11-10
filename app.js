const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/orders', orderRouter);

app.use(globalErrorHandler);

module.exports = app;
