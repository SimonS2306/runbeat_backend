module.exports = userRoutes;

function userRoutes(passport) {
console.log('in userRoutes');
    var userController = require('./userController');
    var router = require('express').Router();


    router.post('/login', userController.login);
    router.post('/register', userController.register);
    router.post('/unregister', passport.authenticate('jwt', {session: false}),userController.unregister);
    router.get('/logout', userController.logout);
    router.get('/user', userController.getUser);
    router.post('/update', userController.putUser);
    router.delete('/user', userController.deleteUser);
    router.get('/users', userController.getUsers);
    
    return router;

}