(function() {
    'use strict';
    angular
        .module('cmsApp', ['appRoutes', 'angularModalService', '720kb.datepicker', 'ngFileUpload', 'facebook', 'googleplus',
            'mainController', 'sessionService',
            'profileController', 'userController', 'sessionService', 'profileService', 'eventsController', 'eventsService', 'ngMessages', 'formDirectives', 'reverseDirective'
        ])

    .config(['GooglePlusProvider', function(GooglePlusProvider) {
            GooglePlusProvider.init({
                clientId: '449868292098-843m5i48ls8v7nv5met6dpfi461o8t6d.apps.googleusercontent.com',
                apiKey: 'AIzaSyDva5tbS-eK9p9H3sIRB7gQ-hvSvTvbPc4'
            });
        }])
        .config(function(FacebookProvider) {
            // Set your appId through the setAppId method or
            // use the shortcut in the initialize method directly.
            FacebookProvider.init('1760445724170206');
            //  FacebookProvider.setPermissions("email,user_likes");
            //  FacebookProvider.setVersion("v2.3");
        });
})();