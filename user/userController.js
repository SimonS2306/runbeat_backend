var Config = require('../config/config.js');
var User = require('./userSchema');
var Profile = require('../profile/profileSchema');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');

module.exports.login = function(req, res){

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
                console.log(createToken(user));
                res.status(200).json({token: createToken(user)});
            }
        });
    });

};

module.exports.register = function(req, res){
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
        emptyProfile.birthday = "23.06.1993";
        emptyProfile.profileImagePath = "null";
        emptyProfile.credo = "Don't hate the player, hate the game!"

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

module.exports.updateProfile = function(req, res){
    var name = req.params.name;
    res.json(name);
}

module.exports.viewProfile = function(req, res){
    var name = req.params.name;
    res.json(name);
}

module.exports.unregister = function(req, res) {
    req.user.remove().then(function (user) {
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};

module.exports.logout = function(req,res){
    req.logout();
    res.status(200).json({
        status: 'Logout successful'
    });
}

module.exports.getUsers = function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(users);
    });
};

exports.getUser = function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if(!user){
            res.status(400).send("Username not found");
            return;
        }
        if(user.password != req.body.password){
            res.status(400).send("Incorrect password!");
            return;
        }
        console.log("Current User: " + user);
        res.json(user);
    });
};

exports.putUser = function(req, res) {
    console.log('updating user');
    console.log(req.body);
    User.find({username: req.body.username}, function(err, doc) {
console.log('inside find');
        console.log(doc);
         var condition= {username: req.body.username}
         , update = {username : '1234567' , email : 'abc1@gmail.com'};
       User.findOneAndUpdate(condition,update,{updert : true},function (err,doc) {
           console.log('inside update method');
           if(err) return res.send(500,{error : err});
           return res.send("success saved");

       })
    });

};

exports.deleteUser = function(req, res) {
    User.findById(req.params.user_id, function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        //authorize
        if (m.user && req.user.equals(m.user)) {
            m.remove();
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }

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
};