const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('../models/user')
var User = mongoose.model('user');

module.exports = function(passport){
    console.log("configures");
passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
User.findOne({email:email}).then(function(user){
if(!user){
    console.log('user dosent exist');
    return done(null,false,{message:"User dosent exist"});
}else{
    bcrypt.compare(password,user.password,(err,isMatch)=>{
        if(err) throw err;
        if(isMatch){
            console.log("password matches and user exits");
            return done(null,user);
        }else{
            console.log("errores");
            return done(null, false,{message:"user dosent exist"});
        }
        });
}

});
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}