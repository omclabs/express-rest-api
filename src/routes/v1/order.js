const router = require('express').Router();

const orders = require('../../controllers/v1/order');
const verifyToken = require('../../middlewares/verifyToken');

router.use(verifyToken);

router.get('/', orders.getOrders);

module.exports = router;
