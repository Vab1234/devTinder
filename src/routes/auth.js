// All the apis specific to auth will be here

const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator")


// post request to handle dignup
authRouter.post("/signup" , async (req , res) => {
    try{
        // Validating the data
        validateSignUpData(req); 

        // Encrypting the data
        const { firstName , lastName , emailId , password , age , gender , skills} = req.body;
        const passwordHash = await bcrypt.hash(password , 10);

        const user = new User({
            firstName ,
            lastName,
            emailId,
            password : passwordHash,
        });

        // // if we do not pass id mongodb automatically adds an _id and __v into the document i.e inside our collection in db

        // // creating an instance of our User Model manually
        // const user = new User(userObj); //userObj will be created here itself manually

        const savedUser = await user.save(); 
        //after .save this data will be saved onto a db and this .save will return a promise so we will have to make it await and make this function an async fn
        // WHENEVER WE ARE DOING SOMETHING WITH THE DB(PUT , GET  POST , DELETE , PATCH) WE MOSTLY MAKE IT AS AN ASYNC AWAIT

        const token = await savedUser.getJWT();
        res.cookie("token" , token , {
            expires : new Date(Date.now() + 8 * 3600000),
        });

        // after saving the user it will send a response
        res.json({message : "User Added Successfully" , data : savedUser});
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/login" , async (req , res) => {
    try{
        const {emailId , password} = req.body;

        if(!validator.isEmail(emailId)){
            throw new Error("Email id not valid");
        }   
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        
        if(isPasswordValid){
            // create a JWT token
            // const token = jwt.sign(hidden deta , secret key known only ny the server)
            const token = await user.getJWT();
            // console.log("The token is " + token)
            // the cookie that the server will send from here will contain the userid encrypted

            // Add the token to cookie and send it back to the user 
            res.cookie("token" , token);
            res.send(user)
        }else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("Something went wrong!!" + err.message);
    }
});

// logout api
authRouter.post("/logout" ,  async (req , res) => {
    // simply expiring the cookies we can logout the user
    res.cookie("token" , null , {expires : new Date(Date.now())});
    res.send("User logged out")
})



module.exports = authRouter;