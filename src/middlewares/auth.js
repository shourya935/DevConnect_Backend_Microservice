// user Authentication Middleware
const { User } = require("../models/user");
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
  try {
    // 1️ Get token from cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // 2️ Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET );
    const { _id } = decoded;

    // 3️ Find user in DB
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    // 4️ Attach user to request
    req.user = user;
    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err.message);

    // JWT expired or invalid token
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};


module.exports = { userAuth };


