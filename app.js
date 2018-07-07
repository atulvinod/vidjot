const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport);
const ideaRoutes = require('./routes/ideas.js');
const userRoutes = require('./routes/users.js');

var app = express();


app.use(expressSession({
    secret:'super duper secret',
    resave:true,
    saveUninitialized:true

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.del_success = req.flash('del_success');
    res.locals.user = req.user || null;
   
 
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

// configure idea routes and user routes via router
app.use('/ideas',ideaRoutes);
app.use('/users',userRoutes);

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



// initialise server
const port = 8080;
app.listen(port, () => {
    console.log("Server started at " + port);
});