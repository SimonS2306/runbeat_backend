
module.exports = challengeRoutes;

function challengeRoutes(passport) {

    var challengeController = require('./challengeController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    router.route('/challenges')
        .post(challengeController.postChallenge)
        .get(challengeController.getChallenge);

    router.route('/challenges/:challenges_id')
        .get(challengeController.getChallenge)
        .put(challengeController.putChallenge)
        .delete(challengeController.deleteChallenge);

    return router;
}
