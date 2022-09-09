const Router = require('express');
const router = new Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, userController.getUser);
router.get('/:id', authMiddleware, userController.getUserById);
router.patch('/me/password', authMiddleware, userController.changePassword);
router.patch('/me/photo', authMiddleware, userController.changePhoto);
router.delete('/me', authMiddleware, userController.deleteUser);


module.exports = router;