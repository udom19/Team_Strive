const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

mongoose.connect('mongodb://strive:strive19@ds125628.mlab.com:25628/team_strive', {
    // mongoose.connect('mongodb://localhost/team-strive', {
    useNewUrlParser: true,
    useCreateIndex: true
  })
    .then(() => {
      console.log("DB connected succesfully")
    })
    .catch(err => {
      console.log('An error occured when try to connect to Database', err)
    });

const port = process.env.PORT || 5000;


const publicDir = require('path').join(__dirname,'/public');


app.use(expressLayout);
// Express Session
app.use(session({
  secret: 'Capital of Nigeria',
  resave: true,
  saveUninitialized: true
}));

// Connect Flash
app.use(flash());
// Body-parser
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());



// Global Vars
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

 // Public files
 app.use(express.static(publicDir));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


app.listen(port, console.log('Strive app started on port ' + port));