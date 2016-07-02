var Config = require('../config/config.js');
var User = require('./userSchema');
var Profile = require('../profile/profileSchema');
var jwt = require('jwt-simple');



module.exports.main = function(req,res){

}

module.exports.loginPage = function(req,res){

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
            res.status(500).json("Existing user name!");
            return;
        }

        var emptyProfile = new Profile();
        emptyProfile.name = user.username;
        emptyProfile.firstName = "John";
        emptyProfile.lastName = "Deo";
        emptyProfile.birthday = "1970-1-1";
        emptyProfile.profileImagePath = "null";

        console.log(emptyProfile);
        emptyProfile.save(function (error, resp){
            if (error) {
                res.status(500).json("Server Failed!");
                console.log(error);
                return;
            }
            res.status(201).json({token: createToken(user)});
        })

    });
};

module.exports.unregister = function(req, res) {
    req.user.remove().then(function () { //or .then/function(user)...?
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};

module.exports.updateProfile = function(req, res){
    var name = req.params.name;
    res.json(name);
}

module.exports.viewProfile = function(req, res){
    var name = req.params.name;
    res.json(name);
}


function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            username: user.username
        }

    };
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
}
