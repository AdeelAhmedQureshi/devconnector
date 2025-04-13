/*
    we can also put education validation inside profile.js(validator.folder),
    but we prefer separate file to avoid messyness of code
*/
const validator =  require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data){
    let errors = {};

//checking each possible cases:
    // school Validation
    if(validator.isEmpty(data.school || "")){
        errors.school = "School field is required";
    }

    // degree Validation
    if(validator.isEmpty(data.degree || "")){
        errors.degree = "Degree field is required";
    }
    // field_of_education Validation
    if(validator.isEmpty(data.fieldofstudy || "")){
        errors.fieldofstudy = "Fieldofstudy field is required";
    }
    //From Validation
    if(validator.isEmpty(data.from || "")){
        errors.from = "From date field is required";
    }

    return {
        errors,     //errors: errors
        isValid: isEmpty(errors)
    }
}