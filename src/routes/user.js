const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connRequest")
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName" , "lastName" , "photoUrl" , "gender" , "skills"];

// get all the pending conn reqs of the loggedin user
userRouter.get("/user/requests/received" , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId" , USER_SAFE_DATA);
            
        // with the ref we connected the two schemas the user one and connreq one and after getting the data pf conn reqs we populate the conn req db with the firstname and lastname of the user sending the req

        res.json({
            message : "Data fetched successfully",
            data : connectionRequests,
        });
    }
    catch(err){
        res.status(400).send("Something went wrong : " + err.message);
    }
});

// get api to get all the connected users to a person ie the accepted status reqs
userRouter.get("/user/requests/accepted" , userAuth , async (req , res) =>{
    try{
        const loggedInUser = req.user;

        const acceptedRequests = await ConnectionRequest.find({
            $or:[
                {toUserId : loggedInUser._id},
                {fromUserId : loggedInUser._id}
            ],
            status : "accepted",
        }).populate("fromUserId" , USER_SAFE_DATA)
        .populate("toUserId" , USER_SAFE_DATA);

        // console.log(acceptedRequests)
        const data = acceptedRequests.map((row) => {
            // .toString() bcoz we cannot compare two mongodb id's directly
            if(loggedInUser._id.toString() === row.fromUserId._id.toString()){
                return row.toUserId;
            }
            else{
                return row.fromUserId;
            }
        });

        res.json({
            message : "Data fetched Successfully",
            data : data,
        });
    }
    catch(err){
        res.status(400).send("Something went wrong" + err.message);
    }

})

module.exports = userRouter;