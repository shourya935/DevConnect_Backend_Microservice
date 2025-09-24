// user Authentication Middleware
const { User } = require("../models/user");
const jwt = require("jsonwebtoken")

const userAuth = async (req,res,next) => {
    try{
        //validate the user
        const {token} = req.cookies
        if(!token){
            res.status(401).send("Invalid token Please LogIn Again")
        }
        const decoded = jwt.verify(token,"Devtinder$qwer")

        const {_id} = decoded

        const user = await User.findById(_id)

        if(!user){
            throw new Error("user not found!! please first register yourself")
        }
        req.user = user
        next()

    }catch(err){
        res.status(404).send("ERROR:" + err.message)
    }
}



// const userAuth = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       return res.redirect("/login");
//     }

//     const decoded = jwt.verify(token, "Devtinder$qwer");

//     const user = await User.findById(decoded._id);

//     if (!user) {
//       return res.redirect("/login");
//     }

//     req.user = user;

//     // Redirect to dashboard if already logged in and accessing login/register route
//     if (req.path === "/login" || req.path === "/register") {
//       return res.redirect("/dashboard");
//     }

//     next();
//   } catch (err) {
//     console.error("Auth Error:", err.message);
//     res.redirect("/login");
//   }
// };

module.exports = { userAuth };


module.exports = {
    userAuth
}