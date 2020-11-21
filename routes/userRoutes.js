const { Router } = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { protect } = require('../controllers/authController');

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/:userId', userController.getUser);
router.patch('/favorite', protect, userController.addToFavorites);

module.exports = router;
