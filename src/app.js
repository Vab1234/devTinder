const express = require("express");
const connectDb = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors");

// creating a server
const app = express();

// to send data dynamically throughe req body we will need a middleware known as "express.json()" so that server can understand json
app.use((express.json())); //middlewares which will work for every req as we have used "use" and have not passed any specific route

// to read cookies
app.use(cookieParser());

// to handle CORS error
app.use(cors())

// Importing the routes(Basicaally importing tjhe routes)
const authRouter = require("./routes/auth");
const profileRouter =  require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user")

// Using the routes
app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestsRouter);
app.use("/" , userRouter);


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