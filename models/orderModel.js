const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  orderItems: [
    {
      productItem: {
        type: String,
        required: [true, 'Order must have a Product'],
      },
      image: {
        type: String,
        required: [true, 'Product must have a photo'],
      },
      qty: {
        type: Number,
        required: [true, 'Product must have a quantity'],
      },
      price: {
        type: Number,
        required: [true, 'Product must have a price'],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, 'Please add a total price'],
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Order = model('Order', orderSchema);

module.exports = Order;
