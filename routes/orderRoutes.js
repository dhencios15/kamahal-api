const { Router } = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../controllers/authController');

const router = Router();

router
  .route('/')
  .get(protect, orderController.getUserOrder)
  .post(protect, orderController.createOrder);

module.exports = router;
