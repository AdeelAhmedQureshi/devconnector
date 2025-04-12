const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

// load Profile Model
const Profile = require('../models/Profile');
// Load User Model
const User = require('../models/User');
//now we can use those in monogoose.

// @route GET api/profile/test
// @desc  Test profile route
// @access public
router.get('/test',(req,res)=> res.json({msg: "Profile works"}));

// @route GET api/profile
// @desc  Get current user profile (protected route)
// @access private
router.get(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req,res)=> {
        const errors = {};

        Profile.findOne({user: req.user.id})
            .then(profile => {
                if(!profile){
                    errors.noprofile = " There is no profile for this user";
                    // res.status(404);  Set status return res then res.json(errors); // Send response 
                    return res.status(404).json(errors);   // method chaining
                }
                return res.json(profile);
            })
            .catch(err => res.status(404).json(err))
    }
);

module.exports = router;
