const router = require('express').Router();

const posts = require('../../controllers/v1/posts');
const verifyToken = require('../../middlewares/verifyToken');

router.use(verifyToken);

router.get('/', posts.getPosts);

module.exports = router;
