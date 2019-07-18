const express = require ('express');
const exphbs = require ('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();

const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

mongoose.connect('mongodb://localhost/vidjot-dev',{
    useNewUrlParser: true
})
 .then(() => console.log('MongoDB Connected....'))
 .catch((err) => console.log(err));

//handle bar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next){
    console.log('req:'+ req.user);
    res.locals.success_msg = req.flash('success_msg');;
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; 
    next();
}) ;

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    const title = 'Welcome';
    res.render('index',{title:title});
});

app.get('/about', (req,res) => {
    res.render('about');
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;
app.listen(port,() => {
    console.log(`listening on ${port}`);
});