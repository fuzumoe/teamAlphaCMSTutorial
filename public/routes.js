angular.module('appRoutes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {

        $routeProvider

            .when('/', {
                templateUrl: 'views/pages/home.html',
                controller: 'MainController',
                controllerAs: 'main',
                resolve: {
                    "check": function($location, session) {
                        if (session.isLoggedIn()) {
                            $location.path('/'); //redirect user to home.
                        }
                    }
                }
            })
            .when('/login', {
                templateUrl: 'views/pages/login.html',
                controller: 'MainController',
                controllerAs: 'auth',
                resolve: {
                    "check": function($location, session) {
                        if (session.isLoggedIn()) {
                            $location.path('/'); //redirect user to home.
                        }
                    }
                }
            })
            .when('/signup', {
                templateUrl: '/views/pages/signup.html',
                controller: 'MainController',
                controllerAs: 'reg',
                resolve: {
                    "check": function($location, session) {
                        if (session.isLoggedIn()) {
                            $location.path('/'); //redirect user to home.
                        }
                    }
                }
            })

        .when('/getaccount', {
                templateUrl: '/views/pages/getaccount.html'
            })
            .when('/events', {
                templateUrl: '/views/pages/events.html',
                controller: 'EventsController',
                controllerAs: 'events'


            })
            .when('/users', {
                templateUrl: '/views/pages/users.html',
                controller: 'UserController',
                controllerAs: 'usr'
            })
            .when('/tasks', {
                templateUrl: '/views/pages/tasks.html',
                controller: 'EventsController',
                controllerAs: 'tsk'
            })
            .when('/messages', {
                templateUrl: '/views/pages/messages.html',
                controller: 'UserController',
                controllerAs: 'msg'
            })
            .when('/profile', {
                templateUrl: '/views/pages/profile.html',
                controller: 'ProfileController',
                controllerAs: 'prf'
            })

        .when('/papers', {
                templateUrl: '/views/pages/papers.html',
                controller: 'EventsController',
                controllerAs: 'pap'
            })
            .when('/more', {
                templateUrl: '/views/pages/more.html',
                controller: 'MainController',
                controllerAs: 'more'

            }).otherwise({ redirectTo: '/' });;

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });