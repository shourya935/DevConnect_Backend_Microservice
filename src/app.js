const express = require("express");
const app = express();
require("./config/database");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests")

app.use("/",authRouter);
app.use("/", profileRouter);
app.use("/",requestRouter)




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
