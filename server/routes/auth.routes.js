const Router = require('express');
const router = new Router();
const authController = require('../controllers/auth.controller');
const sendEmail = require('../middleware/sendEmailMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, authController.authUser );
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/forgot_password', authController.forgotPassword, sendEmail);

module.exports = router;