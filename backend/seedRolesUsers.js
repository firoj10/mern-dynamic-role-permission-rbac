const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Permission = require("./models/permissionModel");
const Role = require("./models/roleModel");
const User = require("./models/userModel");

const MONGO_URI = "mongodb://localhost:27017/mvc_test";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error(err));

async function seed() {
  try {
    // 1️⃣ Clear existing data
    await Permission.deleteMany({});
    await Role.deleteMany({});
    await User.deleteMany({});

    console.log("Old data cleared");

    // 2️⃣ Create Permissions
    const permissionsData = [
      { name: "post.create", description: "Create Post", module: "post" },
      { name: "post.edit", description: "Edit Post", module: "post" },
      { name: "post.delete", description: "Delete Post", module: "post" },
      { name: "post.view", description: "View Post", module: "post" },
    ];
    const savedPermissions = await Permission.insertMany(permissionsData);
    console.log("Permissions created");

    // Helper function to get permission IDs by names
    const getPermissionIds = (names) => {
      return savedPermissions.filter(p => names.includes(p.name)).map(p => p._id);
    };

    // 3️⃣ Create Roles
    const adminRole = new Role({
      name: "Admin",
      permissions: getPermissionIds(["post.create", "post.edit", "post.delete", "post.view"]),
    });

    const managerRole = new Role({
      name: "Manager",
      permissions: getPermissionIds(["post.create", "post.edit", "post.view"]), // no delete
    });

    const userRole = new Role({
      name: "User",
      permissions: getPermissionIds(["post.create", "post.view"]), // only create & view
    });

    await adminRole.save();
    await managerRole.save();
    await userRole.save();
    console.log("Roles created");

    // 4️⃣ Create Users with correct role IDs
    const users = [
      {
        name: "Super Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("Admin@123", 10),
        roles: [adminRole._id],
      },
      {
        name: "Manager User",
        email: "manager@example.com",
        password: await bcrypt.hash("Manager@123", 10),
        roles: [managerRole._id],
      },
      {
        name: "Normal User",
        email: "user@example.com",
        password: await bcrypt.hash("User@123", 10),
        roles: [userRole._id],
      },
    ];

    await User.insertMany(users);
    console.log("Users created ✅ Admin, Manager, User");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
