
const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { protect } = require("../middlewares/authMiddleware");
const {requireRole} = require("../middlewares/authMiddleware"); // protects admin actions

router.post("/", protect, requireRole("Admin"), roleController.createRole);
router.get("/", protect, requireRole("Admin"), roleController.listRoles);
router.get("/:id", protect, requireRole("Admin"), roleController.getRole);
router.put("/:id", protect, requireRole("Admin"), roleController.updateRole);
router.delete("/:id", protect, requireRole("Admin"), roleController.deleteRole);

module.exports = router;

