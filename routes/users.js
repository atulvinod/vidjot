const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/user')
const User = mongoose.model('user');


router.get('/login', (req, res) => {
    res.render('loginpage');
});
router.get('/signup', (req, res) => {
    res.render('signup');

});
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg',"You have successfully logged out");
res.redirect('/users/login');
});
router.post('/login', function (req, res,next) {
    passport.authenticate('local',{
        successRedirect:'/ideas/view',
        failureRedirect:'/users/login',
        failureFlash:true,
    })(req,res,next);

});
router.post('/signup', function (req, res) {
    User.findOne({
        email: req.body.email
    }).then(function (doc) {
        if (doc) {
            req.flash('error_msg', "User already exists with this email");
            res.redirect('/users/login');
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.pass, salt, function (err, hash) {
                    console.log(req.body.email);
                    var user = {
                        
                     
                        email:req.body.email,
                        password: hash,
                        user:req.body.user,
                    }

                    new User(user).save();
                    req.flash('success_msg', "User registered, you can log in now");
                    res.redirect('/users/login');
                });
            })
        }
    })




});
module.exports = router;