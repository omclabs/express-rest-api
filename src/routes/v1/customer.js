const router = require('express').Router();

const customer = require('../../controllers/v1/customer');
const verifyToken = require('../../middlewares/verifyToken');

router.use(verifyToken);

router.get('/', customer.getCustomers);
router.get('/:customer_id', customer.findCustomers);
router.post('/create', customer.createCustomers);
router.delete('/delete/:customer_id', customer.deleteCustomers);

module.exports = router;
