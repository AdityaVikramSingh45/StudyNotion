const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

// Load env variables
dotenv.config();

// Import routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payment");
const courseRoutes = require("./routes/course");
const contactRoutes = require("./routes/contact");

// Import DB config and cloudinary
const dbConnect = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Connect DB
dbConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"], // React dev server
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary
cloudinaryConnect();

// Mount API routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/contact", contactRoutes);

// Default API route
app.get("/api/v1", (req, res) => {
  return res.json({
    success: true,
    message: "Welcome to the default route page",
  });
});

// -------------------------
// Serve React Frontend Build
// -------------------------
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// -------------------------

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
