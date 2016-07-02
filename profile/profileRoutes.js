/**
 * Created by panfei on 16/6/30.
 */
module.exports = profileRoutes;
var multer = require("multer");
var upload = multer({dest: './uploads/'});

function profileRoutes(passport) {

    var userController = require('./profileController');
    var router = require('express').Router();

    // router.get("/",userController.main);
    // router.get('/login', userController.loginPage);
    router.get('/profile/:name', userController.viewProfile);
    router.post('/profile/:name', userController.updateProfile);
    router.post('/profile/upload/:name', upload.single("profileImage"), userController.uploadProfileImage);
    router.get('/profile/image/:id', userController.downloadProfileImage);
    return router;

}