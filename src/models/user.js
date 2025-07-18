// to design schema for user collection

const mongoose  = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// schema design
const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        max : 20,
        min : 2,
    },
    lastName : {
        type : String,
        max : 20,
        min : 2,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email not valid! Please enter a valid email");
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is weak!! Enter a strong one")
            }
        }
    },
    age : {
        type : Number,
    },
    gender : {
        type : String,
        lowercase : true,
        validate(value){
            if(!["male" , "female" , "other"].includes(value)){
                throw new Error(" : Not a valid gender");
            }
        },
    },
    photoUrl : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error(": Photo url not valid")
            }
        }
    },
    skills : {
        type : [String],
    },
    description : {
        type : String,
        default : "This is a default description",
    }
} , {
    timestamps : true,    //this will help track updation and creation timings of our documents
});

// using schema methods to offload some functionalties is always a good practice
userSchema.methods.getJWT = async function (){
    const user = this;
    // console.log(user);
    const token = jwt.sign({_id : user._id} , "devTinder@000" , {
        expiresIn : "7d"
    });
    // console.log(token)
    return token;
}

userSchema.methods.validatePassword = async function (passwordSentByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordSentByUser , passwordHash);
    return isPasswordValid;
}

// after creating a schema we create a mongoose model
// Name of mongoose model starts with a capital letter
// mongoose.model(Name of model , schema of model)
const User = mongoose.model("User" , userSchema);


// exporting the model
module.exports = User;