const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/login',(req,res)=>{
    res.render('loginpage');
});
router.get('/signup',(req,res)=>{
    res.render('signup');

});
router.post('/signup',function(req,res){
console.log(req.body);
});
module.exports = router;