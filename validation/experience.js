/*
    we can also put experience validation inside profile.js(validator.folder),
    but we prefer separate file to avoid messyness of code
*/
const validator =  require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){
    let errors = {};

//checking each possible cases:
    // Title Validation
    if(validator.isEmpty(data.title || "")){
        errors.title = "Job title field is required";
    }

    // Company Validation
    if(validator.isEmpty(data.company || "")){
        errors.company = "Company field is required";
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