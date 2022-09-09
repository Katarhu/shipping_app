const Router = require('express');
const router = new Router();
const truckController = require('../controllers/truck.controller');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.get('/', checkRoleMiddleware('DRIVER'),truckController.getTrucks);
router.post('/', checkRoleMiddleware('DRIVER'),  truckController.addTruck);
router.get('/:id', checkRoleMiddleware('DRIVER'), truckController.getTruck);
router.put('/:id', checkRoleMiddleware('DRIVER'),  truckController.updateTruck);
router.delete('/:id', checkRoleMiddleware('DRIVER'), truckController.deleteTruck);
router.post('/:id/assign', checkRoleMiddleware('DRIVER'), truckController.assignTruck);

module.exports = router;