/**
 * Load modules for application
 */

angular.

    module('RunBeatApp', [
        'ui.router',
        'ui.bootstrap'
    ])

    .constant('CONFIG',
        {
            DebugMode: true,
            StepCounter: 0,
            APIHost: 'http://localhost:12017'
        });