const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }, // e.g., "post.create"
  description: { type: String },
  module: { type: String }, // optional, e.g., "post"
}, { timestamps: true });

module.exports = mongoose.model("Permission", permissionSchema);




