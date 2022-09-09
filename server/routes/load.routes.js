const Router = require('express');
const router = new Router();
const loadController = require('../controllers/load.controller');
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', authMiddleware, loadController.getLoads)
router.post('', checkRoleMiddleware('SHIPPER'), loadController.createLoad)
router.get('/active', checkRoleMiddleware('DRIVER'), loadController.getActiveLoads);
router.patch('/active/state', checkRoleMiddleware('DRIVER'), loadController.proceedLoadState);
router.get('/:id', authMiddleware, loadController.getLoad);
router.put('/:id', checkRoleMiddleware('SHIPPER'), loadController.updateLoad);
router.delete('/:id', checkRoleMiddleware('SHIPPER'), loadController.deleteLoad);
router.post('/:id/post', checkRoleMiddleware('SHIPPER'), loadController.postLoad);
router.get('/:id/shipping_info', checkRoleMiddleware('SHIPPER'), loadController.getLoadShippingInfo);

module.exports = router;