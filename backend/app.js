// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// const app = express();
// const userRoutes = require("./routes/userRoutes");

// app.use(express.json());
// app.use(cookieParser()); 
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use("/api/v1/users", userRoutes);

// app.get("/", (req, res) => res.json({ message: "API running 🚀" }));

// module.exports = app;



// const express = require("express");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes"); // route import
// const postRoutes = require("./routes/postRoutes"); // route import
// const permissionRoutes = require("./routes/permissionRoutes");
// const roleRoutes = require("./routes/roleRoutes");
// const app = express();

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

// // route use
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/posts", postRoutes);



// app.use("/api/admin/permissions", permissionRoutes);
// app.use("/api/admin/roles", roleRoutes);


// app.get("/", (req, res) => res.json({ message: "API running"}));
// module.exports = app;


const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// 🔹 cors
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // cookie পাঠানোর জন্য
}));

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/admin/permissions", permissionRoutes);  
app.use("/api/v1/admin/roles", roleRoutes);

app.get("/", (req, res) => res.json({ message: "API running" }));

module.exports = app;














// const express = require("express");
// const app = express();

// app.use(express.json());
// app.use(cookieParser()); // এটা add করতে হবে

// // routes
// const userRoutes = require("./routes/userRoutes");
// app.use("/api/v1/users", userRoutes);

// module.exports = app;
