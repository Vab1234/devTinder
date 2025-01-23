const express = require("express");

// creating a server
const app = express();

// to handle requests ie use() is our request handler
// we use ap.use() the parameters it takes are 
// 1.route
// 2.callback function

app.use("/home" , (req , res) => {
    res.send("You are in home")
});

app.use("/varun",(req , res) => {
    res.send("Hello from the owner")
});

app.use("/test" , (req , res) => {
    res.send("You are in test bitch")
});

app.use("/", (req , res) => {
    res.send("Namaste varun ji")
});
// if we use the above code as the first route in our routes sequence then it will override all other routes

app.listen(3000 , () => {
    console.log("Server is running on port 3000...")
})