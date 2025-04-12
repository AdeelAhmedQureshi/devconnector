const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateProfileInput(data){
    let errors = {};

        /*
        validator's all methods works on string so,
        If the value is null, undefined, or another type, convert it to a string first (e.g., data. name || "").
        It considers spaces as empty, which is useful for strict validation. 
    */
   // so, first goes this
   // The || (OR) operator returns the first truthy value from left to right. so 
   // we can also write in one line:  if(validator.isEmpty(data.name || ""))
   

   data.handle = !isEmpty(data.handle) ? data.handle : "";
   data.status = !isEmpty(data.status) ? data.status : "";
   data.skills = !isEmpty(data.skills) ? data.skills : "";
//checking each possible cases:
    // handle Validation
    if(validator.isEmpty(data.handle )){
        errors.handle = "Handle field is required";
    }else if(!validator.isLength(data.handle, {min:2 , max:40})){
        errors.handle = "handle must be between 2 and 40 characters";
    }

    // skills Validation
    if(validator.isEmpty(data.skills )){
        errors.skills = "skills field is required";
    }

    // status validation
    if(validator.isEmpty(data.status )){
        errors.status = "Status field is required";
    }
    // website validation
    if(!isEmpty(data.website)){
        if(!validator.isURL(data.website)){
            errors.url = "Not a Valid URL";
        }
    }

    // youtube validation
    if(!isEmpty(data.youtube)){
        if(!validator.isURL(data.youtube)){
            errors.url = "Not a Valid URL";
        }
    }

    // facebook validation
    if(!isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook)){
            errors.url = "Not a Valid URL";
        }
    }

    //.twitter validation
    if(!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            errors.url = "Not a Valid URL";
        }
    }

    // linkedin validation
    if(!isEmpty(data.linkedin)){
        if(!validator.isURL(data.linkedin)){
            errors.url = "Not a Valid URL";
        }
    }

    // instagram validation
    if(!isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram)){
            errors.url = "Not a Valid URL";
        }
    }

    
    return {
        errors,     //errors: errors
        isValid: isEmpty(errors)
    }
}