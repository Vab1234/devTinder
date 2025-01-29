const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view" , userAuth , async (req , res) => {
    try{
        // const cookie = req.cookies;
        // const {token} = cookie;

        // if(!token){
        //     throw new Error("Invalid Token")
        // }

        // // validate token
        // const decodedMessage = jwt.verify(token , "devTinder@000")
        // // this gives a decoded value

        // const { _id } = decodedMessage;
        // already taken care of in userAuth

        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong : "  + err.message)
    }
});

profileRouter.patch("/profile/edit" , userAuth , async (req , res) => {
    try{
        if(!validateEditProfileData){
            throw new Error("Invalid edit request");
        }
        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        // looping over every key in ourr req body and editing all the fields in the loop of the loggedin user

        // well have to save the updated user in our db too
        await loggedInUser.save();

        res.json({
            message : `${loggedInUser.firstName} your profile was udpated successfully` , 
            data : loggedInUser
        });

    }catch(err){
        res.status(400).send("Something went wrong " + err.message);
    }
})


module.exports = profileRouter;