const validator =  require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
    let errors = {};

        /*
        validator's all methods works on string so,
        If the value is null, undefined, or another type, convert it to a string first (e.g., data. name || "").
        It considers spaces as empty, which is useful for strict validation. 
    */
   // so, first goes this
   // The || (OR) operator returns the first truthy value from left to right. so 
   // we can also write in one line:  if(validator.isEmpty(data.name || ""))
   data.email= !isEmpty(data.email) ? data.email : "";
   data.password= !isEmpty(data.password) ? data.password : "";

     //checking each possible cases:

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

    return {
        errors, //errors: errors
        isValid: isEmpty(errors)
    }
}