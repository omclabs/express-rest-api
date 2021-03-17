const router = require('express').Router();

const auth = require('../../controllers/v1/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.delete('/logout', auth.logout);
router.post('/token', auth.token);

module.exports = router;
