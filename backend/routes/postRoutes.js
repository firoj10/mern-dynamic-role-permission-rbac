const express = require("express");
const router = express.Router();
const { protect} = require("../middlewares/authMiddleware");
const { requirePermission } = require("../middlewares/authMiddleware");


const {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
} = require("../controllers/postController");

// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// const { protect } = require("../middlewares/authMiddleware");

// Public Route
router.get("/", getPosts);
router.get("/:id", getPostById);

// Protected Routes with Permissions
router.post("/", protect, requirePermission("post.create"), createPost);
router.put("/:id", protect, requirePermission("post.edit"), updatePost);
router.delete("/:id", protect, requirePermission("post.delete"), deletePost);

module.exports = router;
