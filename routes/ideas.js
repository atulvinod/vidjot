const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/idea');
const Idea = mongoose.model('ideas');

// ideas routes
router.get('/submit', function (req, res) {
    res.render('submitIdea');
});

router.get('/view', function (req, res) {

    var idea = Idea.find({}).sort({
        date: 'desc'
    }).then(ideas => {
        res.render('listidea', {
            ideas: ideas,
        });
    });
});

router.post('/upload', function (req, res) {
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
        var idea = {
            title: req.body.ideaName,
            details: req.body.idea,
        }
        req.flash('success_msg','Added');
        new Idea(idea).save();
        res.redirect('/ideas/view');
    }

});

router.get('/edit/view/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(function (idea) {
        res.render('editpage', {
            idea: idea
        });
    })
});
// ideas to be edited
router.put('/edit/:id', function (req, res) {
    Idea.findOne({
        _id: req.params.id
    }).then(function (idea) {
        idea.title = req.body.ideaName;
        idea.details = req.body.idea;

        idea.save().then(function (idea) {
            console.log("redirect");
            res.redirect('/ideas/view');
        })
    })
});

router.delete('/edit/:id', function (req, res) {
    req.flash('success_msg',"deletion success");
    Idea.remove({
        _id: req.params.id
    }).then(function (i) {
        
        Idea.find({}).sort({
            date: 'desc'
        }).then(ideas => {
           
            res.render('listidea', {
                ideas: ideas,
            });
        });
    })
});




module.exports = router;