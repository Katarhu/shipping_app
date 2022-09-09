const Router = require('express');
const router = new Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const loadRoutes = require('./load.routes');
const truckRoutes = require('./truck.routes');
const chatRoutes = require('./chat.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/loads', loadRoutes);
router.use('/trucks', truckRoutes);
router.use('/chats', chatRoutes);

module.exports = router;