/**
 * Created by panfei on 16/6/30.
 */
var Profile = require("./profileSchema");
var User = require("../user/userSchema");
var mongoose = require("mongoose");
var fs = require('fs');
var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;
var multer = require("multer");
var mime = require("mime");


module.exports.updateProfile = function(req, res){
    var name = req.params.name;
    console.log(name);

    if(!name){
        res.status(400).send('Username required');
        return;
    }

    var profile = new Profile();

    profile.name = name;
    profile.firstName = req.body.firstName;
    profile.lastName = req.body.lastName;
    profile.birthday = req.body.birthday;
    profile.profileImagePath = req.body.profileImagePath;
    profile.credo = req.body.credo;

    Profile.findOne({name: name}, function(err, profile) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!profile) {
            res.status(401).send('No such user!');
            return;
        }

        console.log(profile.name);
        profile.update(profile, {name: name}, function(err){
            if (err) {
                res.status(500).json("Server is not available");
                return;
            }

            res.status(201).json("Successful Update");
        });
    });


    /*profile.save(function(err) {
        if (err) {
            res.status(500).send("Server is not available");
            console.log(err);
            return;
        }

        res.status(201).json("Successful Update");
    });*/

}

module.exports.viewProfile = function(req, res){
    var name = req.params.name;

    Profile.findOne({name: name}, function(err, profile){
        if (err) {
            res.status(500).send("Server is not available");
            return
        }

        if (!profile) {
            res.status(401).send('No such user!'+name);
            return;
        }

        res.status(200).json(profile);

    });
}

module.exports.uploadProfileImage = function(req, res){

    var name = req.params.name;
    console.log(req.body);
    console.log(req.file);

    var type = req.file.mimetype;
    Profile.findOne({name: name}, function(err, profile){
        if (err){
            res.status(500).send("Server is not available");
            return;
        }
        if (!profile) {
            res.status(401).send('No such user!'+name);
            return;
        }
        profile.profileImagePath = req.file.name;
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