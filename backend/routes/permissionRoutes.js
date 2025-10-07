
const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");
// const { protect } = require("../middlewares/authMiddleware");
// const {requireRole} = require("../middlewares/requireRole"); // optional admin-only
const { protect, requirePermission, requireRole } = require("../middlewares/authMiddleware");

// Admin-only endpoints: protect + requireRole('Admin') OR protect + requirePermission('permission.manage')
router.post("/", protect, requireRole("Admin"), permissionController.createPermission);
router.get("/", protect, requireRole("Admin"), permissionController.listPermissions);
router.get("/:id", protect, requireRole("Admin"), permissionController.getPermission);
router.put("/:id", protect, requireRole("Admin"), permissionController.updatePermission);
router.delete("/:id", protect, requireRole("Admin"), permissionController.deletePermission);

module.exports = router;

