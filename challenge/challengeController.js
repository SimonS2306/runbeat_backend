var Challenge = require('./challengeSchema');

exports.postChallenge = function(req, res) {

    var challenge = new Challenge(req.body);

    //do not allow user to fake identity. The user who posted the challenge must be the same user that is logged in
    if (!req.user.equals(challenge.participants.sender)) {
        res.sendStatus(401);
    }

    challenge.save(function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json(m);
    });
};

// Create endpoint /api/challenges for GET
exports.getChallenges = function(req, res) {
    Challenge.find(function(err, challenges) {
        if (err) {
            res.status(500).send(err);
            return;
        }
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
    challenge.findByIdAndUpdate(
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
    challenge.findById(req.params.challenge_id, function(err, m) {
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