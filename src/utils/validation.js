// API level validation
const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName , lastName , password , emailId} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }

}

const validateEditProfileData = (req) =>{
    const ALLOWED_FIELDS = ["about" , "firstName" , "lastName" , "photoUrl" , "skills" , "gender" , "age" , "description"];

    const isEditAllowed = Object.keys(req.body).every((k) => {
        ALLOWED_FIELDS.includes(k);
    });
    return isEditAllowed;
}

module.exports = {validateSignUpData , validateEditProfileData};