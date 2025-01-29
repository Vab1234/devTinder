const express = require("express");
const connectDb = require("./config/database")
// import database file here so that we can run it also to connect to our db
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

// creating a server
const app = express();


// to send data dynamically throughe req body we will need a middleware known as "express.json()" so that server can understand json
app.use((express.json())); //middlewares which will work for every req as we have used "use" and have not passed any specific route

// to read cookies
app.use(cookieParser());

// post request to handle dignup
app.post("/signup" , async (req , res) => {
    try{
        // Validating the data
        validateSignUpData(req); 

        // Encrypting the data
        const { firstName , lastName , emailId , password } = req.body;
        const passwordHash = await bcypt.hash(password , 10);
        console.log(passwordHash);

        const user = new User({
            firstName ,
            lastName,
            emailId,
            password : passwordHash
        });

        // // if we do not pass id mongodb automatically adds an _id and __v into the document i.e inside our collection in db

        // // creating an instance of our User Model manually
        // const user = new User(userObj); //userObj will be created here itself manually

        await user.save(); 
        //after .save this data will be saved onto a db and this .save will return a promise so we will have to make it await and make this function an async fn
        // WHENEVER WE ARE DOING SOMETHING WITH THE DB(PUT , GET  POST , DELETE , PATCH) WE MOSTLY MAKE IT AS AN ASYNC AWAIT

        // after saving the user it will send a response
        res.send("User Added Successfully");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/login" , async (req , res) => {
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
            res.send("Login successful")
        }else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("Something went wrong!!" + err.message);
    }
});

app.get("/profile" , userAuth , async (req , res) => {
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

        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong : "  + err.message)
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