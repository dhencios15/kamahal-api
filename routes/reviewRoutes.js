const { Router } = require('express');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../controllers/authController');

const router = Router();

router.route('/').get(reviewController.getReviews);

router
  .route('/:productId')
  .get(reviewController.getReview)
  .post(protect, reviewController.createReview);

module.exports = router;
