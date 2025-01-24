// to design schema for user collection

const mongoose  = require("mongoose");

// schema design
const userSchema = new mongoose.Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String
    },
    password : {
        type : String
    },
    age : {
        type : Number
    },
    gender : {
        type : String
    },
});

// after creating a schema we create a mongoose model
// Name of mongoose model starts with a capital letter
// mongoose.model(Name of model , schema of model)
const User = mongoose.model("User" , userSchema);


// exporting the model
module.exports = User;