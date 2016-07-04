var Config = require('../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var mime= require("mime");
var multer =require("multer");
var FriendReq = require("./friendReqSchema");
var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;
var fs = require('fs');

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
            res.status(500).send(err);
            return;
        }
        res.status(201).json({token: createToken(user)});
    });
};

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
    console.log('Hello from get user '+req.params.ID);
    User.findOne({_id: req.params.ID}, function(err, user) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if(!user){
            res.status(400).send("Username not found");
            return;
        }
        console.log("Current User: " + user);
        console.log('response JSON '+res.send(JSON.parse(JSON.stringify(user))));
      // console.log('JSOn Res '+res.end(user.toJSON()));
       // var a= res.json(user);
       //  console.log('JSON Res '+a);
    });
};

exports.putUser = function(req, res) {
    console.log('updating user');
    console.log('backend user body'+req.body.email);
    // var img= req.file.mimetype;
    // console.log(img);
    //console.log('profile picture attr'+req.body.profilePicture);
    //,dateOfBirth: req.body.,profileImagePath : req.body.data
    User.find({username: req.body.username}, function(err, doc) {
console.log('inside find');
        console.log(doc);
         var condition= {_id: req.body._id}, update = {
             username : 'efgh' ,
             email : req.body.email,
             dateOfBirth: req.body.birthday,
             credo : req.body.credo
         
         };
       User.findOneAndUpdate(condition,update,{update : true},function (err,doc) {
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
            username: user.username,
            dateOfBirth:user.dateOfBirth,
            credo:user.credo,
            email:user.email
        }

    };
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
};


/* From Fei */


exports.getFriends = function(req, res){
    User.findOne({username: req.params.name}, function(err, user){
        var data = [];
        if (user) {
            if (user.friends.length > 0) {
                for (i=0; i< user.friends.length; i++) {
                    var friend = user.friends[i];
                    User.findOne({username: friend}, function (error, userFriend) {
                        // console.log(friend + "   " + userFriend)
                        data.push(userFriend);
                        if (data.length === user.friends.length) {
                            res.status(200).json(data);
                        }
                    });
                }
            } else {
                res.status(200).json(data);
            }
        } else {
            res.status(400).json("No such user");
        }

    });
}


exports.addFriendRequest = function(req, res){
    var request = new FriendReq();
    request.sender = req.body.sender;
    request.receiver = req.body.receiver;
    request.status = 0;
    request.save();
    res.status(200).send();
}

exports.deleteFriendRequest = function(req, res){
    var id = req.params.id;
    var request = FriendReq.find({_id: id});
    request.remove(function (err, deletedreq){
        if (err) {
            res.status(500).json("server error");
            return;
        }
        res.status(200).json("delete successfully");
    });
}

exports.getFriendRequests = function(req, res){
    var username = req.params.username;
    FriendReq.find({receiver: username}, function(err, requests){
        if (err) {
            res.status(500).json("sever is not available");
            return;
        }
        var data = [];
        // console.log(requests);
        if (requests) {
            res.status(200).json(requests);

        } else {
            res.status(200).json(data);
        }
    });
}

exports.acceptFriendRequest = function(req, res){
    var id = req.params.id;
    FriendReq.findOne({_id: id}, function(err, request){
        if (err) {
            res.status(500).json("sever is not available");
            return;
        }
        if (!request){
            res.status(400).json("there is no such request");
            return;
        }
        /*  1. update sender   */
        User.findOne({username: request.sender}, function(err, sender){
            if (err) {
                res.status(500).json("sever is not available");
                return;
            }
            if (!sender){
                res.status(400).json("there is no such sender");
                return;
            }
            if (!sender.friends) {
                sender.friends = [];
            }
            //  console.log(sender);
            //  console.log(request.receiver);
            sender.friends.push(request.receiver);
            // console.log(sender);
            sender.update(sender, {name: request.sender}, function(err){
                if (err) {
                    res.status(500).json("sever is not available");
                    return;
                }
                /*  2. update receiver   */
                User.findOne({username: request.receiver}, function(err, receiver) {
                    if (err) {
                        res.status(500).json("sever is not available");
                        return;
                    }
                    if (!receiver) {
                        res.status(400).json("there is no such receiver");
                        return;
                    }
                    receiver.friends.push(request.sender);
                    receiver.update(receiver, {name: request.receiver}, function (err) {
                        if (err) {
                            res.status(500).json("sever is not available");
                            return;
                        }
                        /*  3. delete friendreq   */
                        request.remove(function (err, deletedreq){
                            if (err) {
                                res.status(500).json("server error");
                                return;
                            }
                            res.status(200).json("accept succesful");
                        });

                    });
                });
            });
        });


    });
}

exports.deleteFriend = function(req,res){
    var username = req.body.username;
    var deletedFriend = req.body.deletedFriend;

    User.findOne({username: username}, function(err, user){
        if (err){
            res.status(500).json("sever is not available");
            return;
        }
        if (!user) {
            res.status(400).json("No such user");
            return;
        }
        // console.log(user.friends);
        var index = user.friends.indexOf(deletedFriend);
        user.friends.splice(index, 1);
        User.update(user, {username: user.username}, function (err) {
            if (err){
                res.status(500).json("sever is not available");
                return;
            }
            User.findOne({username: deletedFriend}, function(err, delF){
                if (err){
                    res.status(500).json("sever is not available");
                    return;
                }
                if (!delF) {
                    res.status(400).json("No such user");
                    return;
                }
                var index = delF.friends.indexOf(username);
                delF.friends.splice(index, 1);
                delF.update(delF, {username: delF.username}, function (err) {
                    if (err) {
                        res.status(500).json("sever is not available");
                        return;
                    }
                    res.status(200).json("delete friend succesful");
                });
            });
        });

    });


}

exports.searchUser = function(req, res){
    var username = req.params.username;
    User.find({username: {$regex: username, $options: 'i'}}, function(error, users){
        if (error) {
            res.status(500).json("Server is not available");
        }
        res.status(200).json(users);
    });


}


module.exports.uploadProfileImage = function(req, res){

    var name = req.params.username;
    console.log(req.body);
    console.log(req.file);

    var type = req.file.mimetype;
    User.findOne({username: name}, function(err, user){
        if (err){
            res.status(500).send("Server is not available");
            return;
        }
        if (!user) {
            res.status(401).send('No such user!'+name);
            return;
        }
        user.profileImagePath = req.file.name;
        res.status(200).json("upload profile image successful");
    });

    ;
}

module.exports.downloadProfileImage = function(req, res){
    var pic_id = req.params.id;
    var path = "./uploads/" + pic_id;

    var mine = "image/jpeg";

    res.setHeader('Content-disposition', 'attachment; filename=' + pic_id);
    res.setHeader('Content-type', mine);

    var fileStream = fs.createReadStream(path);
    fileStream.pipe(res);
}