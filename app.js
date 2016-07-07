var Config = require('./config/config.js');

/**
 * db connect
 */
var path=require('path');
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
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

/**
 * app setup
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//passport

var passport = require('passport');
var jwtConfig = require('./passport/jwtConfig');

app.use(passport.initialize());
jwtConfig(passport);

/**
 * routing
 */

var userRoutes = require("./user/userRoutes.js");
var challengeRoutes = require("./challenge/challengeRoutes.js");
console.log('inside app.js');
app.use('/api', challengeRoutes(passport));//changed it from challengeRoutes(passport)
app.use('/user', userRoutes(passport));

module.exports = app;

console.log(app.port);

app.get('/files', function(req, res) {
    // console.log("-----------------------------------------");
    var str = req.url;
    var re = str.split("?");
    var upFolder = "./uploads/";
    var upFile = upFolder.concat(re[1]).toString();

    // console.log(upFolder);

    res.sendFile(path.resolve(upFile));
});