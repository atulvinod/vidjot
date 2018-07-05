const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/vidjot",{ useNewUrlParser: true }).then(()=>console.log("mongodb running")).catch(err => console.log(err));


require('./models/idea');
const Idea = mongoose.model('ideas');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



app.get('/', function (req, res) {
    res.render('index', {
        title: "Hello VidJot"
    });
})
app.get('/about', function (req, res) {
    res.render('about');
});
app.get('/submit', function (req, res) {
    res.render('submitIdea');
});
app.post('/upload', function (req, res) {
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
                    title:req.body.ideaName,
                    details:req.body.idea
                }
                new Idea(idea).save();
                console.log("Saved");
            }

        });
            app.listen(8010, () => {
                console.log("Server started at 8080");
            });
        