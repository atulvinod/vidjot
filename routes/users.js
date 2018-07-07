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
            res.render('signup');
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.pass, salt, function (err, hash) {
                    var user = {
                        email: req.body.email,
                        password: hash
                    }

                    new User(user).save();
                    req.flash('success_msg', "User registered, you can log in now");
                    res.render('signup');
                });
            })
        }
    })




});
module.exports = router;