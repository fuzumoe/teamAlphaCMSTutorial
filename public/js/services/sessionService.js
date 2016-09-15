// sessionService
/**************************************************************************** */
/**
 * Dependencies
 *  $http,$$q ,sessionToken 
 */

angular.module('sessionService', [])
    .factory('session', function($http, $q, sessionToken) {
        //sesionFactory object :: empty 
        var sessionFactory = {};
        //user Social Media object :: empty
        var userSocialMediaData = {};

        // boolean propertiy of sesionFactory object
        sessionFactory.socialMedia = false;

        /*****************************************************/
        // sesionFactory setUserSocialMediaData member method :: sets userSocialMediaData member object of sessionFactory
        sessionFactory.setUserSocialMediaData = function(data, socialMediaType) {
            // console.log(data.email);
            //set socialMedia true
            socialMedia = true;
            //temporoary object :: empty
            tempData = {};
            //if social Media is Facebook then ....
            if (socialMediaType === "FB") {
                tempData.email = data.email;
                tempData.picture = data.picture.data.url;
                tempData.name = data.name;
                sessionFactory.socialMedia = true;
            }
            //if social Media is Google plus then ....
            else if (socialMediaType === "GP") {
                tempData.email = data.email;
                tempData.picture = data.picture;
                tempData.name = data.name;
                sessionFactory.socialMedia = true;
            }
            //else if not using any social media set....
            else {
                userSocialMediaData = data;
                sessionFactory.socialMedia = false;
            }

            //set userSocialMediaData to tempData
            userSocialMediaData = tempData;
        };
        /*****************************************************/

        /*****************************************************/
        // sesionFactory getUserSocialMediaData member method :: returns userSocialMediaData member object of sesionFactory
        sessionFactory.getUserSocialMediaData = function() {

            return userSocialMediaData;
        };
        /*****************************************************/
        /*****************************************************/
        // sesionFactory usingSocialMedia member method :: returns socialMedia boolean member property of sessionFactory object
        sessionFactory.usingSocialMedia = function() {
            return sessionFactory.socialMedia
        };
        /*****************************************************/
        /*****************************************************/
        // sesionFactory usingSocialMedia member method :: returns socialMedia boolean member property of sessionFactory object
        sessionFactory.isusingSocialMedia = function() {
            sessionFactory.socialMedia = true;
        };
        /*****************************************************/
        /*****************************************************/
        // sesionFactory authenticate member method :: authenticates users with email and password as arguments for the method
        sessionFactory.authenticate = function(email, password) {

            console.log(email + " " + password);
            // use ajax post calls to the webservice api  by passing json object of user and password
            return $http.post('/services/login', {
                    email: email,
                    password: password
                })
                //if successfull set user Token :: since this application uses token based authentication
                .success(function(data) {
                    sessionToken.setToken('token', data.token);
                    return data;
                });
        };
        /*****************************************************/

        /*****************************************************/
        // sesionFactory confim member method :: confim users to activate his acount
        sessionFactory.activate = function(code) {

            console.log(code);
            // use ajax post calls to the webservice api  by passing json object of code
            return $http.post('/services/confirm', { code: code })
                //if successfull set user Token :: since this application uses token based authentication
                .success(function(data) {
                    sessionToken.setToken('token', data.token);
                    return data;
                });
        };
        /*****************************************************/

        /*****************************************************/
        // sesionFactory getAccess member method :: get access to forgoten passwrod account 
        sessionFactory.getAccess = function(email) {

            console.log(email);
            // use ajax post calls to the webservice api  by passing json object of code
            return $http.post('/services/temppassword', { email: email })
                //if successfull set response data 
                .success(function(data) {
                    return data;
                });
        };
        /*****************************************************/
        /*****************************************************/
        // sesionFactory authenticate member method :: authenticates users with email and password as arguments for the method
        sessionFactory.createCredentials = function(userData) {
            return $http.post('/services/signup', userData)
                .success(function(data) {
                    sessionToken.setToken('token', data.token);
                    return data;
                });
        };
        /*****************************************************/
        /*****************************************************/
        //sessionFactory logout member method :: logs out user and resets related objects and properties
        sessionFactory.logout = function() {
            sessionToken.setToken('token');
            serSocialMediaData = {};

            sessionFactory.socialMedia = false;
        };
        /*****************************************************/
        // sesionFactory isLoggedIn member method :: checks if user is logged in
        sessionFactory.isLoggedIn = function() {
            //check if users token exist
            if (sessionToken.getToken('token')) {
                return true;
            } else {
                return false;
            }
        };
        /*****************************************************/
        /*****************************************************/
        //sesionFactory getUser member method :: gets  logged in users data
        sessionFactory.getUser = function() {
            //if user token exists in storage
            if (sessionToken.getToken('token')) {
                //use get ajax calls to the webservice and get logged in users data
                return $http.get('/services/me');
            } else {
                //else return failur message object
                return $q.reject({ message: "User has no token" });
            }
        };
        /*****************************************************/

        return sessionFactory;
    })
    /**************************************************************************** */

// sessionToken
/**************************************************************************** */
/**
 * Dependencies
 *  $window
 */

.factory('sessionToken', function($window) {
    //sessionTokenFactory object :: empty 
    var sessionTokenFactory = {};

    /*****************************************************/
    //sessionTokenFactory getToken member method :: gets user token
    sessionTokenFactory.getToken = function(name) {
        return $window.localStorage.getItem(name);
    };
    /*****************************************************/
    /*****************************************************/
    //sessionTokenFactory setToken member method :: sets  user token
    sessionTokenFactory.setToken = function(name, token) {

        if (token) {
            $window.localStorage.setItem(name, token);
        } else {
            $window.localStorage.removeItem(name);
        }
    };
    /*****************************************************/

    return sessionTokenFactory;
})

/**************************************************************************** */

// sessionInterceptor
/**************************************************************************** */
/**
 * Dependencies
 *  $q, $location, sessionToken
 */
.factory('sessionInterceptor', function($q, $location, sessionToken) {

//interceptorFactory object :: empty
var interceptorFactory = {};

/*****************************************************/
//sessioninterceptorFactory request member method :: attaches user token to every requests
sessioninterceptorFactory.request = function(config) {
    var token = sessionToken.getToken();

    if (token) {
        config.headers['x-access-token'] = token;
    }

    return config;
};
/*****************************************************/

//sessioninterceptorFactory  responseError member method :: if users token response is of error redirect to /login page
sessioninterceptorFactory.responseError = function(response) {
    if (response.status == 403) {
        $location.path('/login');
    }
    return $q.reject(response);
};
/*****************************************************/

return interceptorFactory;
});

/**************************************************************************** */
 