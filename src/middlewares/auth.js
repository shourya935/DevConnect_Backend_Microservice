const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: No token provided" 
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    const { _id } = decoded;

    // Find user in DB
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: User not found" 
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err.message);

    // JWT expired or invalid token
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized: Invalid or expired token" 
    });
  }
};

module.exports = { userAuth };