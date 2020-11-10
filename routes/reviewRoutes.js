const { Router } = require('express');
const reviewController = require('../controllers/reviewController');

const router = Router();

router.route('/').get(reviewController.getReviews);

router
  .route('/:productId')
  .get(reviewController.getReview)
  .post(reviewController.createReview);

module.exports = router;
