const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSession = require('express-session');
const flash = require('connect-flash');
var app = express();

app.use(expressSession({
    secret:'super duper secret',
    resave:true,
    saveUninitialized:true

}));
app.use(flash());

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.del_success = req.flash('del_success');
    next();
});

/* initialise mongoDB*/
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/vidjot", {
    useNewUrlParser: true
}).then(() => console.log("mongodb running")).catch(err => console.log(err));
require('./models/idea');
const Idea = mongoose.model('ideas');


/* Initialise body Parser*/
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

/*Initialise Handlebars template engine */
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// configure root route
app.get('/', function (req, res) {
    res.render('index', {
        title: "Hello VidJot"
    });
})

// configure about route
app.get('/about', function (req, res) {
    res.render('about');
});

// ideas routes
app.get('/ideas/submit', function (req, res) {
    res.render('submitIdea');
});

app.get('/ideas/view', function (req, res) {

    var idea = Idea.find({}).sort({
        date: 'desc'
    }).then(ideas => {
        res.render('listidea', {
            ideas: ideas,
        });
    });
});

app.post('/ideas/upload', function (req, res) {
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

app.get('/ideas/edit/view/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(function (idea) {
        res.render('editpage', {
            idea: idea
        });
    })
});
// ideas to be edited
app.put('/ideas/edit/:id', function (req, res) {
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

app.delete('/ideas/edit/:id', function (req, res) {
    Idea.remove({
        _id: req.params.id
    }).then(function (i) {
        req.flash('del_success',"deletion success");
        Idea.find({}).sort({
            date: 'desc'
        }).then(ideas => {
          
            res.render('listidea', {
                ideas: ideas,
            });
        });
    })
});

// initialise server
const port = 8080;
app.listen(port, () => {
    console.log("Server started at " + port);
});