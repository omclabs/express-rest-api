const router = require('express').Router();
const helpers = require('../utils/helpers');

const authRoutes = require('./v1/auth');
const postsRoutes = require('./v1/posts');

router.get('/', (req, res) => {
  res.status(200).json(helpers.formatReturn('success', 200, {}));
});

router.use('/v1', authRoutes);
router.use('/v1/posts', postsRoutes);

module.exports = router;
