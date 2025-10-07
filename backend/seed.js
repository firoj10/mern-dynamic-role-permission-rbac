require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Permission = require("./models/permissionModel");
const Role = require("./models/roleModel");
const User = require("./models/userModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

async function seed() {
  try {
    // 1️⃣ Permissions
    const postPermissions = [
      { name: "post.create", description: "Create Post", module: "post" },
      { name: "post.edit", description: "Edit Post", module: "post" },
      { name: "post.delete", description: "Delete Post", module: "post" },
    ];
    await Permission.deleteMany({});
    const savedPermissions = await Permission.insertMany(postPermissions);

    // 2️⃣ Roles
    await Role.deleteMany({});
    const adminRole = new Role({
      name: "Admin",
      permissions: savedPermissions.map((p) => p._id),
    });
    const managerRole = new Role({
      name: "Manager",
      permissions: savedPermissions
        .filter((p) => p.name !== "post.delete")
        .map((p) => p._id),
    });
    const userRole = new Role({
      name: "User",
      permissions: savedPermissions
        .filter((p) => p.name === "post.create")
        .map((p) => p._id),
    });

    await adminRole.save();
    await managerRole.save();
    await userRole.save();

    // 3️⃣ Users
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("Admin@123", 10);
    const adminUser = new User({
      name: "Super Admin",
      email: "admin@example.com",
      password: passwordHash,
      roles: [adminRole._id],
    });

    const managerUser = new User({
      name: "Manager User",
      email: "manager@example.com",
      password: await bcrypt.hash("Manager@123", 10),
      roles: [managerRole._id],
    });

    const normalUser = new User({
      name: "Normal User",
      email: "user@example.com",
      password: await bcrypt.hash("User@123", 10),
      roles: [userRole._id],
    });

    await adminUser.save();
    await managerUser.save();
    await normalUser.save();

    console.log("✅ Seeding complete!");
    console.log("Admin ID:", adminUser._id.toString());
    console.log("Manager ID:", managerUser._id.toString());
    console.log("User ID:", normalUser._id.toString());

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
