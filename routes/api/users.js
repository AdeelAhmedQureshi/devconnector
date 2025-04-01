const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

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
    User.findOne({ email: req.body.email })
     .then(user => {
        if(user){
            return res.status(400).json({email: 'Email already exists'})
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
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})   // or User.findOne({email: email})
        .then(user => {
            if(!user){
               return res.status(404).json({email: "User not found!"});
            }
            // user exit now validating password
            bcrypt.compare(password, user.password)
                .then(isMatched => {
                    //matched
                    if(isMatched){
                        res.json({msg: "success"});
                    }else{
                        return res.status(400).json({password: "Password Incorrect!"});
                    }
                });
        });
});

module.exports = router;
