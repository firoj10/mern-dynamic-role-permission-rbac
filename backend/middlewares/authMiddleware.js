

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");



// module.exports.protect = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.token || req.headers.authorization?.split(" ")[1];

//     if (!token) return res.status(401).json({ message: "No token provided" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id)
//       .populate({ path: "roles", populate: { path: "permissions" } })
//       .select("-password");

//     if (!user) return res.status(401).json({ message: "User not found" });

//     req.user = user;
//     console.log("USER FOUND ✅:", user.email, user.roles.map(r=>r.name));
//     next();
//   } catch (err) {
//     console.error("PROTECT ERROR:", err.message);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };


// module.exports.requirePermission = (permissionName) => {
//   return (req, res, next) => {
//     try {
//       if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//       const userPermissions = new Set();
//       req.user.roles.forEach((role) => {
//         role.permissions.forEach((p) => {
//           if (p?.name) userPermissions.add(p.name);
//         });
//       });

//       if (!userPermissions.has(permissionName))
//         return res.status(403).json({ message: "Forbidden: Permission denied" });

//       next();
//     } catch (err) {
//       console.error("PERMISSION ERROR:", err.message);
//       return res.status(403).json({ message: "Forbidden" });
//     }
//   };
// };



// // simple role-check middleware (use in admin panel routes)
// module.exports = function requireRole(roleName) {
//   return (req, res, next) => {
//     try {
//       if (!req.user) return res.status(401).json({ message: "Unauthorized" });
//       const names = (req.user.roles || []).map(r => (r.name ? r.name : r.toString()));
//       if (!names.includes(roleName)) return res.status(403).json({ message: "Forbidden: role required" });
//       next();
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Server error" });
//     }
//   };
// };

// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const Role = require("../models/roleModel");
// const Permission = require("../models/permissionModel");

const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .populate({ path: "roles", populate: { path: "permissions" } })
      .select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    console.log("USER FOUND ✅:", user.email, user.roles.map(r => r.name));
    next();
  } catch (err) {
    console.error("PROTECT ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const requirePermission = (permissionName) => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const userPermissions = new Set();
      req.user.roles.forEach((role) => {
        role.permissions.forEach((p) => {
          if (p?.name) userPermissions.add(p.name);
        });
      });

      if (!userPermissions.has(permissionName))
        return res.status(403).json({ message: "Forbidden: Permission denied" });

      next();
    } catch (err) {
      console.error("PERMISSION ERROR:", err.message);
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};

const requireRole = (roleName) => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const names = (req.user.roles || []).map(r => (r.name ? r.name : r.toString()));
      if (!names.includes(roleName)) return res.status(403).json({ message: "Forbidden: role required" });
      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = { protect, requirePermission, requireRole };
