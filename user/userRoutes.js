module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();

    //router.get ('/', userController.main);
    router.post('/login', userController.login);
    router.post('/register', userController.register);
    router.post('/logout', passport.authenticate('jwt', {session: false}),userController.logout); //; at the end needed?

    return router;

}