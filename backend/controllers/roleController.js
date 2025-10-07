
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const User = require("../models/userModel"); // for safe-delete checks
// const Role = require("../models/roleModel");
// const Permission = require("../models/permissionModel");
// const User = require("../models/userModel");

// Create Role
// / Create role (no populate here)
exports.createRole = async (req, res) => {
  try {
    const { name, permissions = [] } = req.body;
    if (!name) return res.status(400).json({ message: "Role name is required" });

    // Check duplicate name
    const exists = await Role.findOne({ name });
    if (exists) return res.status(409).json({ message: "Role already exists" });

    // Validate permission IDs
    if (permissions.length) {
      const validCount = await Permission.countDocuments({ _id: { $in: permissions } });
      if (validCount !== permissions.length)
        return res.status(400).json({ message: "One or more permission IDs are invalid" });
    }

    // Create role
    const role = await Role.create({ name, permissions });

    // Return role (no populate here, populate only in GET routes)
    res.status(201).json(role);
  } catch (err) {
    console.error("CREATE ROLE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List roles (populate permissions)
exports.listRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions", "name description module").lean();
    res.json(roles);
  } catch (err) {
    console.error("LIST ROLES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single role
exports.getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
      .populate("permissions", "name description module")
      .lean();
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    console.error("GET ROLE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update Role
exports.updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (name && name !== role.name) role.name = name;

    if (permissions !== undefined) {
      const validCount = await Permission.countDocuments({ _id: { $in: permissions } });
      if (validCount !== permissions.length) return res.status(400).json({ message: "Invalid permission IDs" });
      role.permissions = permissions;
    }

    await role.save();
    const populated = await Role.findById(role._id).populate({ path: "permissions", select: "name" });
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const used = await User.findOne({ roles: roleId }).lean();
    if (used) return res.status(400).json({ message: "Role assigned to user(s). Unassign first." });

    await Role.findByIdAndDelete(roleId);
    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
