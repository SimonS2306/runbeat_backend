var Challenge = require('./challengeSchema');
var Config = require('../config/config.js');
var User = require('../user/userSchema');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');

//Create a challenge

exports.postChallenge = function(req, res) {

    var challenge = new Challenge(req.body);
    challenge.mode = 1;

    //do not allow user to fake identity. The user who posted the challenge must be the same user that is logged in
    //if (!req.user.equals(challenge.sender)) {
    //    res.sendStatus(401);


    challenge.save(function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json(m);
    });
};

//Get the methods you are looking for

//1: "getReceived()": User is receiver who can accept/decline challenge
// Needs as req the wanted receiver, gives back all the challenges were the user is the receiver


exports.getChallenges_1 = function(req, res) {
    Challenge.find({ mode: 1, receiver: req.body.receiver},function(err, challenges) {
        console.log("Requests for: " + req.body.receiver);
        if (err) {
            res.status(500).send(err);
            return;
        }
        //challenges = Challenge.find({ mode: 1, receiver: req.body.receiver});
        //console.log(challenges);
        res.json(challenges);
    });
};

//2: "getSent()": User is sender and waits for receiver
// Needs as req the wanted user who is the sender, gives back all pending challenges from the sender

exports.getChallenges_2 = function(req, res) {
    Challenge.find({ mode: 1, sender: req.body.sender},function(err, challenges) {
        console.log("Requests from: " + req.body.sender);
        if (err) {
            res.status(500).send(err);
            return;
        }
        //challenges = Challenge.find({ mode: 1, receiver: req.body.receiver});
        //console.log(challenges);
        res.json(challenges);
    });
};

//3: "getOngoing()"
// Needs as the request the username for sender/receiver, gives back all ongoing challenges for that user
//req example: sender: simon, receiver: simon

exports.getChallenges_3 = function(req, res) {
    Challenge.find({
            $or: [
                {mode: 2, sender: req.body.sender},
                {mode: 2, receiver: req.body.receiver}]
        },

        function (err, challenges) {

            console.log("Ongoings for: " + req.body.receiver);
            if (err) {
                res.status(500).send(err);
                return;
            }
            //challenges = Challenge.find({ mode: 1, receiver: req.body.receiver});
            //console.log(challenges);
            res.json(challenges);

        });
};

//4: getHistory()
//needs as request challenge sender, gives back all finished challenges
//req example: sender: simon, receiver: simon

exports.getChallenges_4 = function(req, res) {
    Challenge.find({
            $or: [
                {mode: 3, sender: req.body.sender},
                {mode: 3, receiver: req.body.receiver}]
        },

        function (err, challenges) {

            console.log("History for: " + req.body.receiver);
            if (err) {
                res.status(500).send(err);
                return;
            }
            //challenges = Challenge.find({ mode: 1, receiver: req.body.receiver});
            //console.log(challenges);
            res.json(challenges);

        });
};

//Update Methods


//Update status for getChallenge_1 and getChallenge_2, when challenge has been accepted

exports.updateChallenge_2 = function(req, res) {

    Challenge.findByIdAndUpdate(
        req.params.challenge_id,
        { $set: { mode: 2 }}
        , function (err, challenge) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(challenge);
        });
    console.log('Mode update to ongoing');

};

//when challenge has changes from ongoin (mode 2) to finished (mode 3)

exports.updateChallenge_3 = function(req, res) {

    Challenge.findByIdAndUpdate(
        req.params.challenge_id,
        { $set: { mode: 3 }}
        , function (err, challenge) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(challenge);
        });
    console.log('Mode update to finished');

};

// Create endpoint /api/challenges/:challenge_id for GET
exports.getChallenge = function(req, res) {
    // Use the Beer model to find a specific beer
    Challenge.findById(req.params.challenge_id, function(err, challenge) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json(challenge);
    });
};

// Create endpoint /api/challenges/:challenge_id for PUT
exports.putChallenge = function(req, res) {
    // Use the Beer model to find a specific beer
    Challenge.findByIdAndUpdate(
        req.params.challenge_id,
        req.body, 
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, challenge) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(challenge);
    });

};

// Create endpoint /api/challenges/:challenge_id for DELETE
exports.deleteChallenge = function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Challenge.findById(req.params.challenge_id, function(err, m) {
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