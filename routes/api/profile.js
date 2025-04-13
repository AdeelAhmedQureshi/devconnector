const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
// Load profile validator
const validateProfileInput = require('../../validation/profile');
// load Experience validator
const validateExperienceInput = require('../../validation/experience');

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
// @desc  Get profile by handle  // SEO friendly way access
// @access public
router.get(
    '/handle/:handle',   // express param get complete segment upto/ after :
    (req,res) =>{
        const errors = {};
        // the way we can get handle from the URL by .params
        Profile.findOne({handle: req.params.handle})  
            .populate('user', ['name', 'avatar'])
            .then(profile =>{
                if(!profile){
                    errors.noprofile="There is no profile for this user.";
                    return res.status(404).json(errors);
                }
                // else
                return res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route GET api/profile/user/user_id
// @desc  Get profile by user_id 
// @access public
router.get(
    '/user/:user_id',   // express param get complete segment upto/ after :
    (req,res) =>{
        const errors = {};
        // the way we can get user_id from the URL by .params
        Profile.findOne({user: req.params.user_id})  
            .populate('user', ['name', 'avatar'])
            .then(profile =>{
                if(!profile){
                    errors.noprofile="There is no profile for this user.";
                    return res.status(404).json(errors);
                }
                // else
                return res.json(profile);
            })
            .catch(err => res.status(404).json({profile: "There is no profile for this user"}));        // or .json(err) mongodb defined error
    }
);

// @route GET api/profile/all
// @desc  Get all profiles
// @access public
router.get('/all', (req,res)=>{
    const errors = {};
    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles=>{
        if(!profiles){
            errors.noprofiles = "There are no profiles";
            return res.status(404).json(errors);
        }
        res.json(profiles)
    })
    .catch(err => res.status(404).json({profile: "There are no profiles"}));
}
)

// @route GET api/profile
// @desc  Get current user profile (protected route)
// @access private
router.get(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req,res)=> {
        const errors = {};

        Profile.findOne({user: req.user.id})
            .populate('user', ['name','avatar'])
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
        // validating first profile inputs
        const {errors , isValid} = validateProfileInput(req.body);
        // check validity if there is any error in validation then res is:
        if(!isValid){
            return res.status(400).json(errors);
        }
        // Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if(req.body.handle) profileFields.handle = req.body.handle;
        if(req.body.company) profileFields.company = req.body.company;
        if(req.body.website) profileFields.website = req.body.website;
        if(req.body.location) profileFields.location = req.body.location;
        if(req.body.bio) profileFields.bio = req.body.bio;
        if(req.body.status) profileFields.status = req.body.status;
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        // Skills (is string in Profile model) so, spit into array
        if(typeof req.body.skills !== undefined){
            profileFields.skills = req.body.skills.split(',');
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
        if(req.body.instagram) profileFields.social.linkedin = req.body.instagram;

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
                            errors.handle = 'That handle already exists';
                            return res.status(404).json(errors);
                        }
                        // save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
                }
            })
    }
);

// @route POST api/profile/experience
// @desc  ADD experience to currect user profile
// @access private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req,res)=>{
    const {errors, isValid} = validateExperienceInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
        .then(profile=>{
            const newExp={
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.currect,
                description: req.body.description
            }

            // Add to experience array
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
})
module.exports = router;
