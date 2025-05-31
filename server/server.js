const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


//Routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payment");
const courseRoutes = require("./routes/course");
const contactRoutes = require("./routes/contact");

const dbConnect = require("./config/database");
dbConnect();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      origin: ["http://localhost:3000"], // Add more origins if needed
      credentials: true,
    })
  );
  

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));

//cloudinary connect
cloudinaryConnect();


//mounting the routes

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/contact", contactRoutes);

app.get("/", (req, res)=>{
    return res.json({
        success: true,
        message: "Welcome to the default route page"
    })
});

app.listen(PORT, ()=>{
    console.log(`Server is listening at ${PORT}`);
})

