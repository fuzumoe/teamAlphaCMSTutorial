 angular.module('profileService', [])
     .factory('profile', function($http) {
         var profileFactory = {};

         /*****************************************************/
         /** create user Credentials
          * @name createCredentials
          *  @param userData json data to be sent to server
          * 
          * */
         profileFactory.createCredentials = function(userData) {
             return $http.post('/services/signup', userData);
         };

         /*****************************************************/
         /*****************************************************/
         /** get all of profile variables
          * @name all
          * @param userData json data to be sent to server
          * 
          * */
         profileFactory.all = function() {
             return $http.get('/services/profile');
         };
         /*****************************************************/
         /** submit papers
          * @name uploadPaper
          * @param data json data (pdf plus string) to be sent to server
          * 
          * */
         profileFactory.uploadPaper = function(data) {

             return $http.post('/services/upload', data);

         };
         /*****************************************************/
         /** update logged user profile
          * @name uploadProfileImage
          * @param data json data (image plus string) to be sent to server
          * 
          * */
         profileFactory.uploadProfileImage = function(data) {

             return $http.post('/services/updateProfile', data);

         };
         /*****************************************************/
         /** get list of all countires
          * @name getListOfCouncties
          * 
          * */
         profileFactory.getListOfCouncties = function() {
             return $http.get('/services/countries');

         };
         /*****************************************************/
         /** get list of all institutions
          * @name getListOfInstitute
          * 
          * */
         profileFactory.getListOfInstitute = function() {
             return $http.get('/services/institutions');

         };
         return profileFactory;
     })

 /*****************************************************/
 /** users service
  *  @dependecies $http
  * */
 .factory('user', function($http) {
     var userFactory = {};

     /*****************************************************/
     /** get list of all users
      * @name getAllUsers
      * 
      * */
     userFactory.getAllUsers = function() {
         return $http.get('/services/users');
     };
     /*****************************************************/
     /*****************************************************/
     /** create new user
      * @name createUser
      * @param userData json data of user Credentials
      * 
      * */
     userFactory.createUser = function(userData) {
         return $http.post('/services/users', userData);
     };
     /*****************************************************/
     /*****************************************************/
     /** update user
      * @name updateUser
      * @param userData json data users data
      * 
      * */
     userFactory.updateUser = function(userData) {
         return $http.put('/services/users', userData);
     }

     /*****************************************************/
     /*****************************************************/
     /** send Message to user
      * @name sendMessageToSelectedOnes
      * @param userData json data users data
      * 
      * */
     userFactory.sendMessageToSelectedOnes = function(userData) {
         return $http.post('/services/sendMailSelected', userData);


         // return $http.get('/services/sendMail', userData);
     };
     /*****************************************************/

     /*****************************************************/
     /** send Message to user 
      * @name sendMessage
      * @param userData json data users data
      * 
      * */
     userFactory.sendMessage = function(userData) {
         return $http.post('/services/sendMail', userData);
     };
     /*****************************************************/
    //  /*****************************************************/
    //  /** send Message to user 
    //   * @name sendMessage
    //   * @param userData json data users data
    //   * 
    //   * */
    //  userFactory.deleterEvent = function(event) {
    //      return $http({
    //          url: '/services/users/',
    //          method: 'DELETE',
    //          data: event,
    //          headers: { "Content-Type": "application/json;charset=utf-8" }
    //      }).then(function(res) {
    //          console.log(res.data);
    //      }, function(error) {
    //          console.log(error);
    //      });

    //  };
     /*****************************************************/
     return userFactory;
 });