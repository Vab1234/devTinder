const express = require("express");
const connectDb = require("./config/database")
// import database file here so that we can run it also to connect to our db
const User = require("./models/user")

// creating a server
const app = express();

// to send data dynamically throughe req body we will need a middleware known as "express.json()" so that server can understand json
app.use((express.json())); //middlewares which will work for every req as we have used "use" and have not passed any specific route

// post request to handle dignup
app.post("/signup" , async (req , res) => {

    // we can directly do this
    const user = new User(req.body);

    // // if we do not pass id mongodb automatically adds an _id and __v into the document i.e inside our collection in db

    // // creating an instance of our User Model manually
    // const user = new User(userObj); //userObj will be created here itself manually

    // // save this instance
    try{
        await user.save(); 
        //after .save this data will be saved onto a db and this .save will return a promise so we will have to make it await and make this function an async fn
        // WHENEVER WE ARE DOING SOMETHING WITH THE DB(PUT , GET  POST , DELETE , PATCH) WE MOSTLY MAKE IT AS AN ASYNC AWAIT

        // after saving the user it will send a response
        res.send("User Added Successfully");
    }
    catch(err){
        res.status(400).send(err.message);
    }
    
});

// to find user by email
app.get("/user" , async (req , res) => {
    const userEmail = req.body.emailId;

    try{
        const user = await User.find({emailId : userEmail});
        // this will return an array of documents with email id that i gave in the req body like this
        // {
        //     "emailId" : "varunbudhani1954@gmail.com"
        // }
        if(user.length === 0){
            res.status(404).send("User not found");
        }else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

// Feed api - to get all the users added in our app
app.get("/feed" , async (req , res) => {
    try{
        const users = await User.find({});  //empty obj will send all the data back
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});

// delete a user by Id
app.delete("/user" , async (req , res) => {
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

// // update details of user using email
// app.patch("/user" , async (req , res) => {
//     const userEmail = req.body.emailId;
//     const userDetails = req.body;
//     console.log(userDetails);
//     try{
//         await User.findOneAndUpdate({"emailId" : userEmail} , userDetails);
//         res.send("User updated Successfully via Email");
//     }catch(err){
//         res.status(400).send("Something went wrong");
//     }
// })

// Update data of the user using id
// we will use patch bcoz patch updates specific fields in a doc and keeps others as it is
// but put updates all fields and if we do not pass vals for any it keeps the null
app.patch("/user/:userId" , async (req , res) => {
    const userId = req.params?.userId;
    const userDetails = req.body; //this will be the data we pass in the request body
    // console.log("in id")
    
    try{
        const ALLOWED_UPDATES = ["age" , "skills" , "gender" , "photoUrl" , "about" , "password"];
        console.log(userDetails)
        const isUpdateAllowed = Object.keys(userDetails).every((k) => {
            return ALLOWED_UPDATES.includes(k);
        });
        console.log(isUpdateAllowed)
        if(!isUpdateAllowed){
            throw new Error(" : Update not allowed")
        }
        if(userDetails?.skills.length > 10) {
            throw new Error(" : Skills cannot be more than 10");
        }
        await User.findByIdAndUpdate(userId , 
            userDetails,
            {runValidators : true},
        );  //this userDetails will be the replacement for prev data
        // if we pass in data that is not present in our userSchema mongo will ognore it
        res.send("User updated successfully via Id");
    }catch(err){
        res.status(404).send("Update failed" + err.message);
    }
});



// connecting to the db an then server will start listening to the reqs
connectDb()
    .then(() => {
        console.log("Db connected successfully");
        app.listen(3000 , () => {
            console.log("Server is running on port 3000...")
        });
        // this will connect to the db first and then listen to incoming reqs bcoz if for some reason db is not connected then we will not call app.listen() and server will not listen to incoming reqs
    })
    .catch((err) => {
        console.error("Cannot connect to Database")
    });