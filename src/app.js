
const express = require("express");
const app = express();
const path = require("path");
require("./config/database");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors")

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  }))
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
    app.listen(3000, () => {
      console.log("app is listning at http://localhost:3000 ");
    });
  })
  .catch((err) => {
    console.error("Database can not be connected", err.message);
  });
