const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');

exports.getUserOrder = asyncHandler(async (req, res) => {
  const userOrder = await Order.find({ userId: req.user._id });
  return res.status(200).json({
    status: 'success',
    count: userOrder.length,
    data: userOrder,
  });
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems } = req.body;

  const prodQty = async () => {
    return Promise.all(
      orderItems.map(async (items) => {
        const prod = await Product.findById({ _id: items.productItem });
        if (!prod) return next(new AppError('No Product Found!', 404));
        if (prod.quantity <= 0) return next(new AppError('Out of Stock!', 404));
        const quantity = prod.quantity - items.qty;
        const doc = await Product.findByIdAndUpdate(
          { _id: items.productItem },
          { quantity }
        );

        return doc.quantity;
      })
    );
  };

  const data = await prodQty();

  if (!data) return next(new AppError('Order Cancelled!', 404));

  const newOrder = await Order.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'New Order Created',
    data: newOrder,
  });
});
