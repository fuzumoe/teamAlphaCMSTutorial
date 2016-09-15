  //Profile Controller

  /**************************************************************************** */
  /**
   * @Dependencies $scope, $http, $rootScope, Upload, session, sessionToken, profile
   */
  angular.module('profileController', ['profileService', 'sessionService'])

  .controller('ProfileController', function($scope, $http, $rootScope, Upload, session, sessionToken, profile) {

      //format javascript date to  mm-dd-yy
      /**
       * @name formatDate
       * @param date javascript  date
       */
      this.formatDate = function(date) {
          return new Date(date).toString().split(" ").slice(0, 4).join(" ");
      }

      //get user profile Image
      this.userProfileImage = sessionToken.getToken('userImage'),
          //users image url field
          $scope.urlField = false;
      //get user profile Image variant for global use
      $scope.userImage = sessionToken.getToken('userImage'),
          //logged in users name
          this.userName = $scope.userName = sessionToken.getToken('userName'),
          //logged in users email
          $scope.userEmail = sessionToken.getToken('userEmail'),
          //logged in users id
          $scope.userId = sessionToken.getToken('userId'),
          //logged in users date of birth formtted variable

          //logged in users address
          $scope.userAddress = sessionToken.getToken('userAddress'),
          //logged in users nationality
          $scope.userNationality = sessionToken.getToken('userNationality'),
          //logged in users Gender
          $scope.userGender = sessionToken.getToken('userGender'),
          //logged in users institute id
          $scope.userInsid = sessionToken.getToken('userInsid'),
          //formated todays date
          $scope.today = String((new Date().getFullYear() - 19) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()),
          $scope.userDob = this.formatDate(sessionToken.getToken('userDob'));


      //is any form under proccessing setting initialy set to false;
      $scope.proccessing = false,
          //list of all countries
          $scope.countries,
          //list of well known German institutes
          $scope.institutes,
          //server messages holder variable
          $scope.message;
      //get list of users
      profile.getListOfCouncties()
          .success(function(response) {
              $scope.countries = response;
              console.log(response);
              console.log($scope.userInsid);
          });
      //get list of institutes
      profile.getListOfInstitute()
          .success(function(response) {
              $scope.institutes = response;
              console.log(response);
              console.log($scope.userInsid);
          });
      profile.all()
          .success(function(response) {
              this.users = response;
          });


      /**
       * read and convert file to base 64 before upload *
       * @name readFile 
       * @param file file to be red and converted
       * @param data data to be sent with binary data
       * 
       */
      this.readFile = function(file, data) {
          var reader = new FileReader();
          reader.addEventListener("loadend", function(evt) {

              profile.uploadProfileImage({ data: data, file: reader.result })
                  .then(function(response) {
                      console.log(response.data.url);
                      sessionToken.setToken('userImage', response.data.url);
                      var d = new Date();
                      document.getElementById("profileImage").src = response.data.url;

                      $scope.proccessing = false;
                  });

          })

          reader.readAsDataURL(file);
      };

      /**
       * update user profile 
       *@name updateProfile
       */
      this.updateProfile = function() {
          $scope.proccessing = true;
          this.userEmail = this.userEmail || $scope.userEmail,

              this.userDob = this.userDob || $scope.userDob,
              this.userNationality = this.userNationality || $scope.userNationality,
              this.userGender = this.userGender || $scope.userGender,
              this.userInsid = this.userInsid || $scope.userInsid,
              this.userAddress = this.userAddress || $scope.userAddress;
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.userName))
              this.userName = this.userName;
          else
              this.userName = $scope.userEmail;

          console.log(this.userName);

          var prop;
          if (this.userImage) {
              prop = "upload";
              console.log($scope.userInsid);
              var datum = {
                  prop: prop,
                  old_email: $scope.userEmail,
                  full_name: this.userName,
                  email: this.userEmail,
                  dob: this.userDob,
                  nat: this.userNationality,
                  gender: this.userGender,
                  insid: this.userInsid,
                  address: this.userAddress,
                  filename: this.userImage.name
              };

              this.readFile(this.userImage, datum);
              this.userProfileImage = sessionToken.getToken('userImage');
          }
          if (this.userImage == null) {
              console.log(this.userEmail);
              prop = "**";
              var datum = {
                  prop: prop,
                  old_email: $scope.userEmail,
                  full_name: this.userName,
                  email: this.userEmail,
                  dob: this.userDob,
                  nat: this.userNationality,
                  gender: this.userGender,
                  insid: this.userInsid,
                  address: this.userAddress,

              };
              profile.uploadProfileImage({ data: datum })
                  .then(function(response) {
                      $scope.message = response.data.message;
                      $scope.proccessing = false;
                  });
          };
      };

      /*****************************************************/
      /**
       * show and hide user image url field
       * @name toggleUrl
       */
      $scope.toggleUrl = function() {
          console.log("toggle");
          $scope.urlField = !$scope.urlField;
      };
      /*****************************************************/


  })

  /****************************************************** */
  /**   Registeration   modal controller
   * @Dependencies User, $location, $window
   */
  .controller('RegisterationController', function(User, $location, $window) {

      this.singupUser = function() {
          this.message = '';
          profile.create(this.userData)
              .then(function(response) {
                  this.userData = {};
                  this.message = response.data.message;
                  $window.localStorage.setItem('token', response.data.token);
                  $location.path('/');
              });
      };
  });