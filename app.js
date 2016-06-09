var Config = require('./config/config.js');

/**
 * db connect
 */

var mongoose = require('mongoose');
mongoose.connect([Config.db.host, '/', Config.db.name].join(''),{
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
});

/**
 * create application
 * dependencies
 */

var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var hash = require('bcrypt-nodejs');
var path = require('path');
var cors = require('cors');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;


/**
 * app setup
 */
var User = require('./user/userSchema.js');
var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
;

//passport config
//var jwtConfig = require('./passport/jwtConfig');


// define middleware

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'very secret secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * routing
 */

var userRoutes = require("./user/userRoutes.js");
var challengeRoutes = require("./challenge/challengeRoutes.js");

app.use('/api/', challengeRoutes(passport));//changed it from challengeRoutes(passport)
app.use('/user/', userRoutes(passport));

module.exports = app;

console.log(app.port);
