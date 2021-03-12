const express = require("express");
const router = express.Router();

const posts = require("../controllers/v1/posts");
const auth = require("../controllers/v1/auth");
const verifyToken = require("../middlewares/verifyToken");

router.post("/token", auth.generateToken);

router.use(verifyToken.public);
router.post("/login", auth.login);
router.post("/register", auth.register);

router.use(verifyToken.private);
router.get("/posts", posts.getPosts);

module.exports = router;
