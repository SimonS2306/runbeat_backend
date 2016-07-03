module.exports = challengeRoutes;

function challengeRoutes() { /*changed it from challengeRoutes(passport)*/

    var challengeController = require('./challengeController');
    var router = require('express').Router();
    var unless = require('express-unless');

    //var mw = passport.authenticate('jwt', {session: false});
    //mw.unless = unless;

    //middleware
    //router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.route('/challenges')
        .post(challengeController.postChallenge)
    router.route('/challenges1')
        .get(challengeController.getChallenges_1)
    router.route('/challenges2')
        .get(challengeController.getChallenges_2)
    router.route('/challenges3')
        .get(challengeController.getChallenges_3)
    router.route('/challenges4')
        .get(challengeController.getChallenges_4)
    router.route('/update3')
        .get(challengeController.updateChallenge3)
    router.route('/update4')
        .get(challengeController.updateChallenge4)
    router.route('/challenges/:challenge_id')
        .get(challengeController.getChallenge)
        .put(challengeController.putChallenge)
        .delete(challengeController.deleteChallenge);

    return router;
}
