const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const chatController = require('../controllers/chat.controller');

router.get('/conversations', authMiddleware, chatController.getConversations );
router.post('/', authMiddleware, chatController.createChat);
router.post('/:id/message', authMiddleware, chatController.addMessage,);
router.delete('/:id', authMiddleware, chatController.deleteChat,);

module.exports = router;