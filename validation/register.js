const validator =  require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data){
    let errors = {};

        /*
        validator's all methods works on string so,
        If the value is null, undefined, or another type, convert it to a string first (e.g., data. name || "").
        It considers spaces as empty, which is useful for strict validation. 
    */
   // so, first goes this
   data.name= !isEmpty(data.name) ? data.name : "";  // here isEmpty() is our own function
   // The || (OR) operator returns the first truthy value from left to right. so 
   // we can also write in one line:  if(validator.isEmpty(data.name || ""))
   data.email= !isEmpty(data.email) ? data.email : "";
   data.password= !isEmpty(data.password) ? data.password : "";
   data.password2= !isEmpty(data.password2) ? data.password2: "";

     //checking each possible cases:

    // Name Validation
    if(validator.isEmpty(data.name)){
        errors.name = "Name field is required";
    }else if(!validator.isLength(data.name, {min: 2 , max: 30 })){
        errors.name = "Name must be between 2 and 30 characters";
    }

    // Email Validation
    if(validator.isEmpty(data.email)){
        errors.email = "Email field is required";
    }else if(!validator.isEmail(data.email)){
        errors.email = "Email is Invalid";
    }

    // Password Validation
    if(validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }else if(!validator.isLength(data.password, {min:8, max:30})){
        errors.password = "Password must be atleast 8 characters";
    }

    // Password2 Validation
    if(validator.isEmpty(data.password2)){
        errors.password2 = "Confirm Password field is required";
    }else if(!validator.equals(data.password, data.password2)){
        errors.password2 = "Passwords must match";
    }
    
    return {
        errors, //errors: errors
        isValid: isEmpty(errors)
    }
}