var Config = require('../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');
var mainPage = '/Users/panfei/Documents/Self Learning/SEBA/seba_team40/frontend/index.html';
var loginPage = '/Users/panfei/Documents/Self Learning/SEBA/seba_team40/frontend/app/shared/login.view.html';

module.exports.main = function(req,res){
    //res.redirect('/login');
    res.status(200).sendFile(mainPage);
}

module.exports.loginPage = function(req,res){
    res.status(200).sendFile(loginPage);
}

module.exports.login = function(req, res){

    console.log("hahahahaha" + req.body + res.body);

    if(!req.body.username){
        res.status(400).send('username required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    User.findOne({username: req.body.username}, function(err, user){
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({token: createToken(user)});
            }
        });
    });

};

module.exports.signup = function(req, res){
    if(!req.body.username){
        res.status(400).send('username required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    var user = new User();

    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json({token: createToken(user)});
    });
};

module.exports.unregister = function(req, res) {
    req.user.remove().then(function () { //or .then/function(user)...?
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};

function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            username: user.username
        }

    };
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
}
