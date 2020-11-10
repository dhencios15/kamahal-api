const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');

exports.getReviews = asyncHandler(async (req, res) => {
  const allReviews = await Review.find().populate({
    path: 'userId',
    select: 'name email',
  });

  res.status(200).json({
    status: 'success',
    totalReviews: allReviews.length,
    data: allReviews,
  });
});

exports.getReview = asyncHandler(async (req, res, next) => {
  const productReviews = await Review.find({
    productId: req.params.productId,
  }).populate({
    path: 'userId',
    select: 'name email',
  });

  if (!productReviews) return next(new AppError('No Review Found!', 404));

  res.status(200).json({
    status: 'success',
    count: productReviews.length,
    data: productReviews,
  });
});

exports.createReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) return next(new AppError('No Product Found!', 404));

  const isReview = await Review.findOne({
    productId: req.params.productId,
    // userId: req.body.userId,
    userId: req.user._id,
  });

  if (isReview) return next(new AppError('Already Reviewed!', 409));

  const review = await Review.create({
    ...req.body,
    productId: req.params.productId,
    // userId: req.body.userId,
    userId: req.user._id,
  });

  res.status(201).json({ status: 'success', data: review });
});
