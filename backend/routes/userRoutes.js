
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const {  requirePermission } = require("../middlewares/authMiddleware");


router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/me", protect, userController.getMe);
router.post("/logout", protect, userController.logoutUser);

// router.get("/",  userController.getAllUsers);

// router.put("/:id", protect, userController.updateUser);
// router.delete("/:id", protect, userController.deleteUser);




// CRUD routes
router.get("/", protect, requirePermission("user.view"), userController.listUsers);
router.get("/:id", protect, requirePermission("user.view"), userController.getUser);
router.put("/:id", protect, requirePermission("user.edit"), userController.updateUser);
router.delete("/:id", protect, requirePermission("user.delete"), userController.deleteUser);

// Assign roles
router.put("/:id/roles", protect, requirePermission("user.edit"), userController.assignRoles);

module.exports = router;




