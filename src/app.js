
const express = require("express");
const app = express();
const path = require("path");
require("./config/database");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://devconnect-peach.vercel.app" , "https://devconnect-mhhs71khe-shouryas-projects-230bf7f7.vercel.app" ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);



app.use(express.urlencoded({ extended: true }));// Parse URL-encoded bodies (from HTML forms)
app.use(express.json());
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// Serve the public folder from project root
app.use(express.static(path.join(__dirname, "../public")));



const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/",authRouter);
app.use("/", profileRouter);
app.use("/",requestRouter)
app.use("/",userRouter)

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database can not be connected", err.message);
  });
