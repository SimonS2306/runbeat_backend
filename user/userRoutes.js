module.exports = userRoutes;

var multer = require("multer");
var upload = multer({dest: './uploads/'});

function userRoutes(passport) {
console.log('in USer Router');
    var userController = require('./userController');
    var router = require('express').Router();


    router.post('/login', userController.login);
    router.post('/register', userController.register);
    router.post('/unregister', passport.authenticate('jwt', {session: false}),userController.unregister);
    router.get('/logout', userController.logout);
    router.get('/getUser/:ID', userController.getUser);
    router.put('/update', userController.putUser);
    router.delete('/user', userController.deleteUser);
    router.get('/users', userController.getUsers);
    /* From Fei */
    router.get('/friends/:name', userController.getFriends);
    router.post('/friendreq', userController.addFriendRequest);
    router.delete('/friendreq/:id', userController.deleteFriendRequest);
    router.put('/friendreq/:id', userController.acceptFriendRequest)
    router.get('/allfriendreqs/:username',  userController.getFriendRequests);
    router.delete('/friend', userController.deleteFriend);
    router.get('/searchUser/:username', userController.searchUser);
    router.post('/image/upload/:username', upload.single("profileImage"), userController.uploadProfileImage);
    router.get('/image/:id', userController.downloadProfileImage);
    router.get('/allsentfriendreq/:username', userController.getSentFriendRequests);

    return router;

}