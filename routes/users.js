const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

// Login
router.get('/login', (req, res) => res.render('login'));

// Signup
router.get('/signup', (req, res) => res.render('signup'));

// Sign Up Handle
router.post('/signup', (req, res) => {
    const { firstname, lastname, email, password, password2, phonenumber } = req.body;
    let errors = [];    
    // Check required Fields
    if(!firstname || !lastname || !email || !password || !password2 || !phonenumber ){
        errors.push({ msg: "Please fill in all fields" });
    }

    // Check password Match
    if(password !== password2) {
        errors.push({ msg: "Password do not match" });
    }

    // Check Password length
    if(password.length < 6 ) {
        errors.push({msg: "Password should be at least 6 characters"});
    }

    if(errors.length > 0 ) {
        res.render("signup", {
            errors,
            firstname,
            lastname,
            email,
            password,
            password2,
            phonenumber
         
            });

    }else{
        // Validation Passed
        User.findOne({ email: email})
        .then(user => {
            if(user) {
                // User exist
                errors.push({msg: "Email is already registered"})
                res.render("signup", {
                    errors,
                    firstname,
                    lastname,
                    email,
                    password,
                    password2,
                    phonenumber
                   
                });
            }else{
                const newUser = new User({
                    firstname,
                    lastname,
                    email,
                    password,
                    password2,
                    phonenumber
                   
                });
                // Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
                    if(err) throw err;
                    // Set password to hash
                    newUser.password = hash;
                    // Save User
                    newUser.save()
                    .then(user => {
                        req.flash("success_msg", "You have successfully registered and can log in");
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }))
            }
        })
    }
})

// Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
})

// Logout Handle
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
})

module.exports= router;