const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../models/roleModel"); // add this line
const mongoose = require("mongoose");


const cookieOptions = {
  httpOnly: true,                  // JS 
  secure: false,                   // dev false, prod true
  sameSite: "lax",                 // dev  lax, prod  strict
  maxAge: 24 * 60 * 60 * 1000,     // 1 day
};
// Register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 👇 Important: use roles (array) directly
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roles: Array.isArray(roles) ? roles : roles ? [roles] : [],
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};




// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
    .populate({
      path: "roles",
      populate: { path: "permissions" },
    });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  // Token create
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Cookie set
  res.cookie("token", token, cookieOptions);


  const userObj = user.toObject();
  delete userObj.password;

  // Merge permissions (optional but recommended)
  const permissions = [];
  user.roles.forEach((role) => {
    role.permissions.forEach((p) => {
      if (!permissions.includes(p.name)) permissions.push(p.name);
    });
  });

  // Final response
  res.status(200).json({
    user: {
      ...userObj,
      permissions,
    },
    token,
  });
};




exports.listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate({
        path: "roles",
        select: "name permissions",
        populate: {
          path: "permissions",
          select: "name",
        },
      });

    // Flatten permissions for each user
    const result = users.map((u) => {
      const permissions = [];
      u.roles.forEach((r) => {
        r.permissions.forEach((p) => {
          if (!permissions.includes(p.name)) permissions.push(p.name);
        });
      });
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        roles: u.roles.map((r) => r.name),
        permissions,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
    }

    // ✅ Fix: sanitize and validate roles input
    if (roles) {
      let roleArray = [];

      if (Array.isArray(roles)) {
        roleArray = roles;
      } else if (typeof roles === "string") {
        try {
          // try to parse if stringified JSON
          const parsed = JSON.parse(roles);
          roleArray = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          roleArray = [roles];
        }
      }

      // filter valid ObjectIds only
      user.roles = roleArray.filter((r) => mongoose.Types.ObjectId.isValid(r));
    }

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("roles", "name permissions");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign role to user
exports.assignRoles = async (req, res) => {
  try {
    const { roles } = req.body; // array of role IDs
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate role IDs
    const validRoles = await Role.find({ _id: { $in: roles } });
    if (validRoles.length !== roles.length) return res.status(400).json({ message: "Some roles are invalid" });

    user.roles = roles;
    await user.save();

    const populated = await User.findById(user._id).populate("roles", "name permissions");
    res.json({ message: "Roles assigned", user: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get current logged-in user
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // protect middleware থেকে set করা
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "roles",
        select: "name permissions",
        populate: {
          path: "permissions",
          select: "name",
        },
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔹 Merge all permissions from all roles
    const permissions = [];
    user.roles.forEach((role) => {
      role.permissions.forEach((p) => {
        if (!permissions.includes(p.name)) permissions.push(p.name);
      });
    });

    // 🔹 Build frontend-friendly clean structure
    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((r) => ({
        name: r.name,
        permissions: r.permissions.map((p) => p.name),
      })),
      permissions, // flattened merged list
    };

    res.status(200).json({ user: responseUser });
  } catch (err) {
    console.error("getMe error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.logoutUser = async (req, res) => {
  try {
    // Optional: Invalidate the user's token version
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { tokenVersion: 1 },
    });

    res.clearCookie("token"); // If using cookies
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
