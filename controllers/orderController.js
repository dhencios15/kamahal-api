const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const AppError = require('../utils/appError');

exports.getUserOrder = asyncHandler(async (req, res) => {
  const userOrder = await Order.find({ userId: req.user._id });
  return res.status(200).json({
    status: 'success',
    count: userOrder.length,
    data: userOrder,
  });
});

exports.createOrder = asyncHandler(async (req, res) => {
  const newOrder = await Order.create({
    ...req.body,
    userId: req.user._id,
  });

  res
    .status(201)
    .json({ status: 'success', message: 'New Order Created', data: newOrder });
});
