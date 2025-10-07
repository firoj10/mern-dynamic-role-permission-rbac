
const Permission = require("../models/permissionModel");

// Create permission
exports.createPermission = async (req, res) => {
  try {
    const { name, description, module } = req.body;
    if (!name) return res.status(400).json({ message: "Permission name is required" });

    const exists = await Permission.findOne({ name });
    if (exists) return res.status(409).json({ message: "Permission already exists" });

    const perm = await Permission.create({ name, description, module });
    res.status(201).json(perm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// List permissions (with simple paging)
exports.listPermissions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || 1));
    const limit = Math.min(100, parseInt(req.query.limit || 50));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Permission.find().sort({ name: 1 }).skip(skip).limit(limit),
      Permission.countDocuments()
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single permission
exports.getPermission = async (req, res) => {
  try {
    const perm = await Permission.findById(req.params.id);
    if (!perm) return res.status(404).json({ message: "Permission not found" });
    res.json(perm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update permission
exports.updatePermission = async (req, res) => {
  try {
    const { name, description, module } = req.body;
    const perm = await Permission.findById(req.params.id);
    if (!perm) return res.status(404).json({ message: "Permission not found" });

    if (name && name !== perm.name) {
      const exists = await Permission.findOne({ name });
      if (exists) return res.status(409).json({ message: "Another permission with this name exists" });
      perm.name = name;
    }
    if (description !== undefined) perm.description = description;
    if (module !== undefined) perm.module = module;

    await perm.save();
    res.json(perm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete permission (only if not used by any role recommended)
const Role = require("../models/roleModel");
exports.deletePermission = async (req, res) => {
  try {
    const permId = req.params.id;
    // check usage
    const used = await Role.findOne({ permissions: permId }).lean();
    if (used) {
      return res.status(400).json({ message: "Permission is assigned to role(s). Unassign before deleting." });
    }
    await Permission.findByIdAndDelete(permId);
    res.json({ message: "Permission deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

