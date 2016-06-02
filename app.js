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

var userRoutes = require("./user/userRoutes");
var challengeRoutes = require("./challenge/challengeRoutes");

//app.use(router);
app.use('/api', challengeRoutes());//changed it from challengeRoutes(passport)
app.use('/', userRoutes(passport));
//app.use('/static', express.static('/Users/sspitzer/WebstormProjects/runbeat_frontend'));
app.use(express.static('/Users/sspitzer/WebstormProjects/runbeat_frontend'));


module.exports = app;

/*console.log(app.port);

var server = app.listen(Config.app.port, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);

});*/