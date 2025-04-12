const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
// const 

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

// @route Post api/profile
// @desc  Create or Edit User Profile
// @access private
router.post(
    '/', 
    passport.authenticate('jwt', {session: false}),
    (req,res)=> {
        

        // Get fields
        const profileFields = {};
        profileFields.user = req.body.user;
        if(req.body.handle) profileFields.handle = req.body.handle;
        if(req.body.company) profileFields.company = req.body.company;
        if(req.body.website) profileFields.website = req.body.website;
        if(req.body.location) profileFields.location = req.body.location;
        if(req.body.bio) profileFields.bio = req.body.bio;
        if(req.body.status) profileFields.status = req.body.status;
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        // Skills (is string in Profile model) so, spit into array
        if(typeof req.body.skills !== undefined){
            profileFields.Skills = req.body.skills.split(',');
        }

        // Social
        profileFields.social={};
        if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
        /*
            Why we use req.body.youtube instead of req.body.social.youtube?
            It’s because of how the frontend sends the data in the request body.
        */
        if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

        //education and experience has separate page like Add education Add experience, they can be multiple.

        // according create and update we set
        Profile.findOne({user: req.user.id})
            .then(profile =>{
                if(profile){
                    // Update
                    Profile.findOneAndUpdate(
                        {user: req.user.id},
                        {$set: profileFields}, //profileFields obj that we have created with all the fields
                        {new: true}
                    ).then(profile => res.json(profile));
                }
                else{
                    //Create
                
                    //Check if handle exist. handle for SEO to access profile page etc
                    Profile.findOne({handle: profileFields.handle}).then(profile =>{
                        if(profile){
                            errors.handle = 'That handle already exists'
                            res.status(404).json(errors)
                        }
                        // save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
                }
            })
    }
);

module.exports = router;
