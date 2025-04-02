const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load user model(mongooseDB schema)
const User = require('../models/User')


// @route GET api/users/test
// @desc  Test users route
// @access public
router.get('/test',(req,res)=> res.send('users works'));

// @route GET api/users/register
// @desc  Register user
// @access public
router.post('/register',(req,res)=> {
    // before register first validate register input
    const {errors, isValid} = validateRegisterInput(req.body);
    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
     .then(user => {
        if(user){
            errors.email = 'Email already exists';
            return res.status(400).json(errors)
        }else{
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating
                d: 'mm' // Default
            } )
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt)=> {
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user=> res.json(user))
                        .catch(err => console.log(err))
                })
            })
        }
     })
});

// @route GET api/users/login
// @desc  Login user / Returning JWT Token
// @access public
router.post('/login', (req, res)=>{
    // before login first validate login input
    const {errors, isValid} = validateLoginInput(req.body);
    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})   // or User.findOne({email: email})
        .then(user => {
            if(!user){
                errors.email= "User not found!";
               return res.status(404).json(errors);
            }
            // user exit now validating password
            bcrypt.compare(password, user.password)
                .then(isMatched => {
                    if(isMatched){
                        // User Matched
                        payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }; // Create JWT payload

                        // jwt.sign()) to generate a token.
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {expiresIn: 3600},
                            (err, token)=>{
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        );
                    }else{
                        errors.password = "Password Incorrect!";
                        return res.status(400).json(errors);
                    }
                });
        });
});

// @route GET api/users/current
// @desc  Return current user who belongs to token.  // validate the user and access protected routes
// @access private
router.get(
    '/current',
    passport.authenticate('jwt', {session: false}),
    (req, res)=>{
        res.json(
            //req.user
            {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            }
        );
    }
);

module.exports = router;
