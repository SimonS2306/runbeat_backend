var Challenge = require('./challengeSchema');
var Config = require('../config/config.js');
var User = require('../user/userSchema');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');

exports.postChallenge = function(req, res) {

    var challenge = new Challenge(req.body);

    //do not allow user to fake identity. The user who posted the challenge must be the same user that is logged in
    //if (!req.user.equals(challenge.participants.sender)) {
    //    res.sendStatus(401);


    challenge.save(function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json(m);
    });
};

//1: "Challenge requests": User is receiver who can accept/decline challenge
// Needs as req the wanted receiver, gives back all the challenges were the user is the receiver

exports.getChallenges_1 = function(req, res) {
    Challenge.find(function(err, challenges) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        challenges = db.challenges.find({ mode: 1, receiver: req.body.receiver});
        console.log(challenges);
        res.json(challenges);
    });
};

//Update status for getChallenge_1 and getChallenge_2, when challenge has been accepted

exports.updateChallenge3 = function(req, res) {

    Challenge.findByIdAndUpdate(
        req.params.challenge_id,
        req.body,
        {
            status: 3,
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
    console.log('Status update to 3')

};

//2: "Issued Challenges": User is sender and waits for receiver
// Needs as req the wanted user who is the sender, gives back all pending challenges from the sender

exports.getChallenges_2 = function(req, res) {
    Challenge.find(function(err, challenges) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        challenges = db.challenges.find({ mode: 2, sender: req.body.sender});
        console.log(challenges);
        res.json(challenges);
    });
};

//3: Challenge accepted by sender and receiver
// Needs as the request the wanted user, gives back all ongoing challenges

exports.getChallenges_3 = function(req, res) {
    Challenge.find(function(err, challenges) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        challenges = db.challenges.find({ mode: 3, sender: req.body.sender});
        console.log(challenges);
        res.json(challenges);
    });
};

//Update method for Challenges that are completed and are now in the finished section after calling the function (status =4)
exports.updateChallenge4 = function(req, res) {

    Challenge.findByIdAndUpdate(
        req.params.challenge_id,
        req.body,
        {
            status: 4,
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
    console.log('Status update to 4')

};

//4: Challenge finished
//needs as request the wanted user, gives back all finished challenges

exports.getChallenges_4 = function(req, res) {
    Challenge.find(function(err, challenges) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        challenges = db.challenges.find({ mode: 4, sender: req.body.sender });
        console.log(challenges);
        res.json(challenges);
    });
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