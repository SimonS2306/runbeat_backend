module.exports = userRoutes;

function userRoutes(passport) {

    /*var userController = require('./userController');
    var router = require('express').Router();

    //router.get ('/', userController.main);
    router.post('/login', userController.login);
    router.post('/register', userController.register);
    router.get('/logout', userController.logout); //; at the end needed?

    return router;

}*/

var express = require('express');
var router = express.Router();

var User = require('../user/userSchema.js');


router.post('/register', function(req, res) {
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
});
    router.post('/updateProfile', function(req, res) {
     console.log(req);
    });

    router.post('/login', function(req, res, next) {
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
                console.log(res);
                res.status(200).json({
                    status: 'Login successful!'
                });
            });
        })(req, res, next);
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

router.get('/status', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true
    });
});

return router;}