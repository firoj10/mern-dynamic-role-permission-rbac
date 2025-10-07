// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true } // store hashed password
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  
  

  tokenVersion: { type: Number, default: 0 }, // for token invalidation
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);







