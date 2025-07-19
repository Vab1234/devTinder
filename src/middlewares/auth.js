const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req , res , next) => {
    /**
     * Read the cookies
     * Validate the token
     * Find the user
     */
    try{
        const {token} = req.cookies;
        console.log("Token in auth middleware: ", token);
        if(!token){
            return res.status(401).send("Please Login");
        }
        console.log(process.env.JWT_SECRET);

        const decodedObj = jwt.verify(token , process.env.JWT_SECRET);
        const { _id } = decodedObj;
        console.log("Decoded Object: ", decodedObj);

        const user = await User.findOne({_id});
        if(!user){
            throw new Error("User not found");
        }
        req.user = user; // attaching the user to the reqs to be used in next req handlers
        next(); // next bcoz this is a middleware and we will moove to the required req handler after this whomsoever calls this
    }catch(err){
        res.status(400).send("Something went wrong in auth : " + err.message); 
    }
}

module.exports = {
    userAuth
}