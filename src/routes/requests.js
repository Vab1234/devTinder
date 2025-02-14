const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId" , userAuth , async (req , res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored" , "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid status type : " + status});
        }

        // cannot allow to send req back to self
        // if(fromUserId == toUserId){
        //     return res.status(400).json({message : "Cannot send request to self"});
        // }
        // we'll be checking this as a schema pre

        // check wether the user that we are sending request to even exists in our db or not
        const toUser = await User.findById(toUserId);
        // console.log(toUser);
        if(!toUser){
            return res.json({message : "User does not exist"});
        }

        // we'll have to check if the user has already sent the req to the same person before or vice versa and if ye dont allow to do this again bcoz this will only dupliacate the reqs 
        // this $or is basically checking if one of the two cases has happnd and send response then nd there itself
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId , toUserId},
                {fromUserId : toUserId , toUserId : fromUserId},
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).json({message : "Connection Request already exists"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message : "Connection Request Sent Successfully",
            data,
        });
    }
    catch(err){
        res.status(400).send("Something went wrong : " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId" , userAuth , async (req , res) =>{
    /**
     * loggedInUser should be the toUserId person
     * toUserId should be valid
     * status should be either accepted or rejected
     */

    try{
        const loggedInUser = req.user;
        const { status , requestId} = req.params;

        const allowedStatus = ["accepted" , "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid status"});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        });
        

        if(!connectionRequest){
            return res.status(404).json({message : "Connection request not found"})
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message : "Connetion request " + status , data});
    }
    catch(err){
        res.status(400).send("Something went wrong : " + err.message);
    }

    
})


module.exports = requestRouter;