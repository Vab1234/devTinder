const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/request/sendConnRequest" , userAuth , async (req , res) => {
    const user = req.user;
    console.log("Sending the conn req");
    res.send(user.firstName + "sent the request");
})

module.exports = requestRouter;