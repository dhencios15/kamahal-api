const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
  const { orderItems, totalPrice } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `http://localhost:3000/`,
    cancel_url: `http://localhost:3000/shop/All`,
    customer_email: req.user.email,
    client_reference_id: uuidv4(),
    // line_items: [
    //   {
    // name: `${tour.name} Tour`,
    // description: tour.summary,
    // images: [
    //   `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
    // ],
    // amount: tour.price * 100,
    // currency: 'php',
    // quantity: 1,
    //   },
    // ],
    line_items: orderItems.map((item) => {
      return {
        name: `${item.name}`,
        images: item.image,
        amount: item.price,
        currency: 'php',
        quantity: item.qty,
      };
    }),
    amount_total: totalPrice,
  });

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
    session,
    orderDetails: newOrder,
  });
});
