const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/idea');
const Idea = mongoose.model('ideas');
const {ensureAuth} = require("../config/auth");




// ideas routes
router.get('/submit',ensureAuth, function (req, res) {
    res.render('submitIdea');
});

router.get('/view',ensureAuth, function (req, res) {

    var idea = Idea.find({user:res.locals.user.user}).sort({
        date: 'desc'
    }).then(ideas => {
        res.render('listidea', {
            ideas: ideas,
        });
    });
});

router.post('/upload',ensureAuth, function (req, res) {
    var errors = [];
    if (!req.body.ideaName) {
        errors.push({
            text: "Enter a Name for the idea"
        });
    }
    if (!req.body.idea) {
        errors.push({
            text: "Enter the idea discription"
        });
    }

    if (errors.length > 0) {
        res.render('submitIdea', {
            error: errors,

        });
    } else {
        console.log(res.locals.user.user);
        var idea = {
           
            title: req.body.ideaName,
            details: req.body.idea,
            user:res.locals.user.user,
        }
        req.flash('success_msg','Added');
        new Idea(idea).save();
        res.redirect('/ideas/view');
    }

});

router.get('/edit/view/:id',ensureAuth, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(function (idea) {
        res.render('editpage', {
            idea: idea
        });
    })
});
// ideas to be edited
router.put('/edit/:id',ensureAuth, function (req, res) {
    Idea.findOne({
        _id: req.params.id
    }).then(function (idea) {
        idea.title = req.body.ideaName;
        idea.details = req.body.idea;

        idea.save().then(function (idea) {
            
            res.redirect('/ideas/view');
        })
    })
});

router.delete('/edit/:id',ensureAuth, function (req, res) {
    req.flash('success_msg',"deletion success");
    Idea.remove({
        _id: req.params.id
    }).then(function (i) {
        
        Idea.find({}).sort({
            date: 'desc'
        }).then(ideas => {
           
            res.redirect('/ideas/view');
           
        });
    })
});




module.exports = router;