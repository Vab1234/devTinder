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
        res.status(400).send("Error saving the user" , err.message)
    }
    
})

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