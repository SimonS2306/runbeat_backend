/*var Config = require('../config/config.js');
var User = require('./userSchema.js');


module.exports.login = function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!'
            });
        });
    })(req, res, next);
};

module.exports.register = function(req, res) {
    User.register(new User({ username: req.body.username }),
        req.body.password, function(err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
};

module.exports.logout = function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
};

module.exports.logout = function(req, res) {
    req.user.remove().then(function () { //or .then/function(user)...?
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};*/
