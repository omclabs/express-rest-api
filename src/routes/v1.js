const express = require("express");
const router = express.Router();

const posts = require("../controllers/v1/posts");
const auth = require("../controllers/v1/auth");
const verifyToken = require("../middlewares/verifyToken");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.delete("/logout", auth.logout);
router.post("/token", auth.token);

router.use(verifyToken);
router.get("/posts", posts.getPosts);

module.exports = router;
