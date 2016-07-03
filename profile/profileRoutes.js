/**
 * Created by panfei on 16/6/30.
 */
module.exports = profileRoutes;
var multer = require("multer");
var upload = multer({dest: './uploads/'});

function profileRoutes(passport) {

    var profileController = require('./profileController');
    var router = require('express').Router();

    // router.get("/",userController.main);
    // router.get('/login', userController.loginPage);
    router.get('/:name', profileController.viewProfile);
    router.post('/:name', profileController.updateProfile);
    router.post('/upload/:name', upload.single("profileImage"), profileController.uploadProfileImage);
    router.get('/image/:id', profileController.downloadProfileImage);
    return router;

}