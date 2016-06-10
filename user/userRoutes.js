module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();

    router.get("/",userController.main);
    router.get('/login', userController.loginPage);
    router.post('/login', userController.login);
    router.post('/signup', userController.signup);
    
    router.post('/unregister', passport.authenticate('jwt', {session: false}),userController.unregister)

    return router;

}