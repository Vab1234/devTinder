const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connRequest")
const userRouter = express.Router();
const User  = require("../models/user");

const USER_SAFE_DATA = ["firstName" , "lastName" , "photoUrl" , "gender" , "skills" , "description" , "age"];

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
// THIS IS THE CONNECTIONS API
// get("/user/requests/accepted" ---- same same
userRouter.get("/user/connections" , userAuth , async (req , res) =>{
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

});

// feed api to get all the other users on our app
userRouter.get("/user/feed" , userAuth , async (req , res) => {
    try{
        // the loggedin user should only see the profiles of those users he is not connected with and hasnt sent any reqs to
        // Thefore user should not see reqs of
        // 0. connected users
        // 1. his own card
        // 2. alredy req sent
        // 3. ignored
        // i.e if there is an entry in the connReq schema then the user should not see that user

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionReqs = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        // set for adding the unwanted user ie users connected
        const hideUsersFromFeed = new Set();

        connectionReqs.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });


        // nin means not in array and ne means not equal
        // this will fetch all those records from the User schema which are not connected by any means to the loggedinuser not even interested , ignored , accepted , rejected
        const users = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);


        // if we have a 1000 users on our app we do not want the api to send us all the users at once but we want them in batches ie if one batch finishes the other batch of users come in
        // ie feed/page=1&limit=10   ===> page 1 0 - 10 ==>  
        // can be done by .skip(0) & .limit(10) this can be implemented i skip 0 and show 10
        // feed/page=2&limit=10      ===> page 2 11 - 20 and so on
        // can be done by .skip(10) & .limit(10)
        // this is known as PAGINATION



        res.json({users});
    }   
    catch(err){
        res.status(400).send("Something went wrong" + err.message);
    }
})

module.exports = userRouter;