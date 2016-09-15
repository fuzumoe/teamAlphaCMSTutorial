//main controller

/**************************************************************************** */
/**
 * @Dependencie $rootScope,$scope,$location,session from sessionServices,Facebook from angular-facebook, GooglePlus from GooglePlus
 */

angular.module('mainController', [])
    .controller('MainController', function($rootScope, $timeout, $scope, ModalService, Upload, $location, session, sessionToken, profile, Facebook, GooglePlus) {
        /* upload file function*/
        // upload on file select or drop
        //is user updating set to false initialy
        this.uploading = false;
        //users privialdge set to false initialy
        $scope.pre = false;
        //server message holder variable
        $scope.message = ""
            //is any form proccessing set to false initialy
        $scope.proccessing = false;
        //list of all countries
        $scope.countries;
        //list of all institutes
        $scope.institutes;
        // papers data options
        this.paperOptionData = {
            auther_name: " ",
            auther_email: " ",
            reviewer_email: " ",
            paper_disc: " ",
            paper_event: " ",
            event_id: " ",
            paper: "",
            reviewer_expertise: " ",
            overall_evaluation: " ",
            summary: " ",
            strong_popints: " ",
            weak_points: " "
        };
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

                profile.uploadProfileImage({ data: data, file: reader.result });
            })
            if (reader.type = 'application/pdf') {
                reader.readAsDataURL(file);
            }
        };
        /**
         * upload paper *
         * @name uploadPaper         
         */
        this.uploadPaper = function() {
            var datum = {
                auther_name: this.paper.auther_name,
                auther_email: this.paper.auther_email,
                paper_event: this.paper.paper_event,
                paper_disc: this.paper.paper_disc,
            }
            console.log(datum);
            this.readFile(this.paper.paper, datum);
        };

        //is user still loggedIn
        $scope.loggedIn = session.isLoggedIn();
        //this user data variable
        $scope.user;
        //filter
        this.searchKeyword = "";
        //get User Social Meida data from session Services
        this.userData = session.getUserSocialMediaData();
        //check if user is using social Media to login
        this.usingSocialMedia = session.usingSocialMedia();
        this.message = "";
        //userImage stored as token
        $scope.userImage = sessionToken.getToken('userImage');
        //userName storec as token
        $scope.userName = sessionToken.getToken('userName');
        //yes no dialog modal result
        $scope.yesNoResult = null;
        //complex dialog modal result
        $scope.complexResult = null;
        //custom dialog modal
        $scope.customResult = null;

        //events data variables
        $scope.eve, $scope.eventDiscription, $scope.eventDate;
        //add new user variables
        $scope.newUserName, $scope.newUserEmail, $scope.newUserInsId;

        //confirmation modal variable
        $scope.yesNoResult = false;
        $scope.clearSearch = function() {
            this.searchKeyword = null;
        }

        /*****************************************************/
        // check if user is logged In on route change
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            //set the loggedIn boolean variable
            $scope.loggedIn = session.isLoggedIn();


            $scope.userImage = sessionToken.getToken('userImage');
            $scope.userName = sessionToken.getToken('userName');
            $scope.clearSearch();
            //get user data
            session.getUser()
                .then(function(data) {
                    $scope.user = data.data;
                });
        });

        /*****************************************************/
        /** 
         * submit paper  *
         * @name submitPaper 
         */
        this.submitPaper = function() {
            this.eventOptionData.title = "Submit Paper";


            this.showSubmissionDetailsModal("Email goes here", "user name", "paper event");

        };
        /*****************************************************/


        // /**********Test Modal Functions ***************/
        // // showConfirmationYesNo
        // /*****************************************************/
        // /*****************************************************/
        // //remove | Delete | Deactivate  user acount
        // this.removeDeleteDeactivate = function() {
        //     $scope.showConfirmationYesNo();

        // };
        // /*****************************************************/
        // /*****************************************************/
        // //activate user acount
        // this.addNewEvent = function() {
        //     $scope.showEventsModal();

        // };
        // /*****************************************************/
        // /*****************************************************/
        // //activate user acount
        // this.sendMessage = function() {

        //     $scope.showMessageModal();
        // };
        // /*****************************************************/
        // /*****************************************************/
        // //activate user acount
        // this.addNewUser = function() {

        //     $scope.showNewUserModal();
        // };
        // /*****************************************************/
        // /*****************************************************/
        // //activate user acount
        // this.activate = function() {
        //     console.log("one two");
        //     $scope.confirmationModal();
        // };
        // /*****************************************************/
        // /**********Test Modal Functions ***************/

        // /*****************************************************/
        /**
         * get Access activate account *
         * @name getAccess 
         */
        this.getAccess = function() {

            this.error = '';
            this.isDisabled = true;
            var email = this.authData.email;
            console.log(email);
            if (email != "" || email != null) {
                session.getAccess(email)
                    .success(function(data) {
                        this.processing = false;
                        session.getUser()
                            .then(function(data) {
                                console.log(data);
                                this.user = data.data;
                            });
                        //if user is authenticated successfully change the route
                        if (data.success) {
                            console.log(data);
                            $scope.showForgetPasswordModal(email);
                            //else report user  error
                        } else {
                            this.error = data.message;
                            this.message = data.message;
                            console.log(data.message);

                        }
                    });

            } else {
                console.log("please provide a valid email");
            }
        };
        /*****************************************************/
        /*****************************************************/
        /**
         * login function*
         * @name doLogin 
         * 
         */
        this.doLogin = function() {
            $scope.proccessing = true;
            this.error = '';
            this.isDisabled = true;

            //use session services to do authentication 
            //use user email and paswoerd for authentication
            session.authenticate(this.authData.email, this.authData.password)
                // get the premise data if user is authenticated
                .success(function(data) {
                    this.processing = false;
                    session.getUser()
                        .then(function(data) {
                            console.log(data);
                            this.user = data.data;
                        });
                    //if user is authenticated successfully change the route
                    if (data.success) {
                        console.log(data);
                        console.log(data.profile.image);
                        console.log(data.profile.name);
                        $scope.pre = data.pre;
                        sessionToken.setToken('userImage', data.profile.image);
                        sessionToken.setToken('userName', data.profile.name);
                        sessionToken.setToken('userEmail', data.profile.email);
                        sessionToken.setToken('userId', data.profile.id);
                        sessionToken.setToken('userDob', data.profile.dob);
                        sessionToken.setToken('userInsid', data.profile.in_id);
                        sessionToken.setToken('userAddress', data.profile.address);
                        sessionToken.setToken('userGender', data.profile.gender);
                        sessionToken.setToken('userNationality', data.profile.nationality);
                        $scope.proccessing = false;
                        console.log(data);
                        $location.path('/');

                    } else {
                        $scope.proccessing = false;
                        this.error = data.message;
                        $scope.message = data.message;

                        console.log(data.message);

                    }
                });
        };

        /*****************************************************/
        /*****************************************************/
        /**
         * signup user*
         * @name doSignUp
         */
        this.doSignUp = function() {


            $scope.proccessing = true;

            this.error = '';
            this.isDisabled = true;
            var email;
            var full_name;
            var createCredentials = {};


            if (this.usingSocialMedia) {
                console.log(usingSocialMedia);
                createCredentials.email = this.userData.email;
                createCredentials.full_name = this.userData.name;
                createCredentials.image = this.userData.picture;
                createCredentials.password = this.user.password;
            } else {
                createCredentials.email = this.user.email;
                createCredentials.full_name = this.user.name;
                createCredentials.password = this.user.password;
            }

            console.log(createCredentials.email);
            if (this.user.password != this.user.userRePassword) {
                $scope.proccessing = false;
                $scope.message = "Password does not match";
            } else {
                //use session services to do authentication 
                //use user email and paswoerd for authentication
                session.createCredentials(createCredentials)
                    // get the premise data if user is authenticated
                    .success(function(data) {
                        this.processing = false;
                        session.getUser()
                            .then(function(data) {
                                console.log(data)
                                this.user = data.data;
                            });
                        //if user is authenticated successfully change the route
                        if (data.success) {
                            if (data.profile) {
                                sessionToken.setToken('userImage', data.profile.image);
                                sessionToken.setToken('userName', data.profile.name);
                                sessionToken.setToken('userEmail', data.profile.email);
                                sessionToken.setToken('userId', data.profile.id);
                                sessionToken.setToken('userDob', data.profile.dob);
                                sessionToken.setToken('userAddress', data.profile.address);
                                sessionToken.setToken('userInsid', data.profile.in_id);
                                sessionToken.setToken('userGender', data.profile.gender);
                                sessionToken.setToken('userNationality', data.profile.nationality);
                                $scope.proccessing = false;
                                $location.path('/');
                            } else {
                                sessionToken.setToken('token');
                                $scope.proccessing = false;
                                $scope.confirmationModal();

                            }

                            //else report user  error
                        } else {
                            this.error = data.message;
                            $scope.proccessing = false;
                            $scope.message = data.message;
                            console.log(data.message);
                        }
                    });
            }

        };

        /*****************************************************/
        /**
         * logout user *
         * @name doLogout
         * 
         */
        this.doLogout = function() {
            //logout using session service provider
            session.logout();
            $scope.loggedIn = false;
            //then release user session data
            session.setUserSocialMediaData({}, "");
            sessionToken.setToken('userImage', "");
            sessionToken.setToken('userInsid', "");
            sessionToken.setToken('userName', "");
            sessionToken.setToken('userEmail', "");
            sessionToken.setToken('userInsid', "");
            sessionToken.setToken('userId', "");
            sessionToken.setToken('userDob', "");
            sessionToken.setToken('userAddress', "");
            sessionToken.setToken('userGender', "");
            sessionToken.setToken('userNationality', "");
            //change the route
            $location.path('/');
            location.reload();
        };
        /*****************************************************/

        /*****************************************************/
        //Fb login section
        /**
          * login using facebook
          * @name fbLogin 
         
          */
        this.fbLogin = function() {
            //use angular-facebook login function to login
            Facebook.login(function(response) {
                //if the user really exists
                if (response.authResponse) {
                    //use the angular-facebook webservice api to fetch user id, email, picture and etc...
                    Facebook.api('/me?fields=email,name,picture', function(response) {

                        console.log(response);
                        // var accessToken = FB.getAuthResponse();
                        //set user data in session services
                        this.usingSocialMedia = true;
                        session.setUserSocialMediaData(response, "FB");
                        console.log(session.getUserSocialMediaData().email);
                        session.isusingSocialMedia();
                        //then change the route to signup 
                        $location.path('/signup');
                    }, {
                        scope: 'email ,user_likes',
                        return_scopes: true
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            });
        };

        /*****************************************************/
        /*****************************************************/
        /**
         * login using facebook*
         * @name gplogin
         * 
         */
        this.gplogin = function() {
            //use angular-GooglePlus to login
            GooglePlus.login()

            //then get the premise data
            .then(function(authResult) {
                    console.log(authResult);
                    //use the angular-GooglePlus to fetch user id, email, picture and etc... from the authResponse  premise data
                    GooglePlus.getUser()
                        .then(function(response) {
                            console.log(response);
                            this.usingSocialMedia = true;
                            //set user data in session services
                            session.setUserSocialMediaData(response, "GP");
                            console.log(session.getUserSocialMediaData().email);
                            session.isusingSocialMedia();

                            //then change the route to signup 
                            $location.path('/signup');
                        });
                },
                //else if erro get the error premise data 
                function(err) {
                    console.log(err);
                    console.log('User cancelled login or did not fully authorize.');
                });
        };
        /** GPlus logout function **/
        this.gplogout = function() {
            GooglePlus.logout(function() {
                this.doLogout();
            });
        };
        /****************************************************** */



        /*****************************************************/
        /**yes no confirmation modal **
         * @name showConfirmationYesNoTwo
         */
        $scope.showConfirmationYesNo = function() {

            ModalService.showModal({
                templateUrl: "/views/pages/modals/confirmationMadal.html",
                controller: "ConfirmationModalController"
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.yesNoResult = result;
                });
            });


        };


        /****************************************************** */
        /*****************************************************/
        /**yes no confirmation modal **
         * @name confirmationModal
         */
        $scope.confirmationModal = function() {

            ModalService.showModal({
                templateUrl: "/views/pages/modals/codeConfirm.html",
                controller: "ConfirmationModal",
                inputs: {
                    title: "User Confirmation Modal"
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    console.log(result);
                    $location.path('/');
                });
            });

        };
        /****************************************************** */
        /*****************************************************/
        /**show ForgetPassword Modal modal **
         * @name showForgetPasswordModal
         * @param authEmail user email
         */
        $scope.showForgetPasswordModal = function(authEmail) {

            ModalService.showModal({
                templateUrl: "/views/pages/modals/getAcces.html",
                controller: "ForgetPasswordModalController",
                inputs: {
                    title: "Forget Password",
                    email: authEmail,
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {

                });
            });

        };
        /****************************************************** */
        /*****************************************************/
        /**show Events Modal  modal **
         * @name showEventsModal
         */
        $scope.showEventsModal = function() {

            ModalService.showModal({

                templateUrl: "/views/pages/modals/eventsFormModal.html",

                controller: "EventsModalController",
                inputs: {
                    title: "New Event"
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    // $scope.eve = result.event;
                    // $scope.eveDiscription = result.discription;
                    // $scope.eveDate = result.date;
                    $scope.event.event.event = result.event;
                    $scope.event.event_disc = req.body.event_disc;
                    $scope.date_time = req.body.date_time;


                });
            });

        };
        /****************************************************** */
        /*****************************************************/
        /**  show NewUser  Modal modal **
         * @name showNewUserModal
         */
        $scope.showNewUserModal = function() {

            ModalService.showModal({

                templateUrl: "/views/pages/modals/newUserModal.html",

                controller: "NewUserModalController",
                inputs: {
                    title: "New User"
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.newUserName = result.name;
                    $scope.newUserEmail = result.email;
                    $scope.newUserInsId = result.insId;
                });
            });

        };
        /****************************************************** */
        /*****************************************************/
        /**show  Message  Modal modal **
         * @name showMessageModal
         */
        $scope.showMessageModal = function() {

            ModalService.showModal({

                templateUrl: "/views/pages/modals/sendMessagModal.html",

                controller: "MessageModalController",
                inputs: {
                    title: "Messaging"
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.message = result.msg;

                });
            });

        };
        /****************************************************** */
        /****************************************************** */

        /****************** DO NOT CONCIDER THE CODE BELWO IT IS TEST CODE****************************************************** *****/
        /***Test modals for more info about this bars just route to /test */

        $scope.showYesNo = function() {

            ModalService.showModal({
                templateUrl: "/views/pages/modals/test/yesno.html",
                controller: "YesNoController"
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.yesNoResult = result ? "You said Yes" : "You said No";
                });
            });


        };



        $scope.showComplex = function() {

            ModalService.showModal({
                templateUrl: "/views/pages/modals/test/complex.html",
                controller: "EventsModalController",
                inputs: {
                    title: "A More Complex Example"
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    $scope.complexResult = "Name: " + result.name + ", age: " + result.age;
                });
            });

        };

        $scope.showCustom = function() {

            ModalService.showModal({
                templateUrl: "/views/pages/modals/test/custom.html",
                controller: "CustomController"
            }).then(function(modal) {
                modal.close.then(function(result) {
                    $scope.customResult = "All good!";
                });
            });

        };

    })
    .controller('ModalController', function($scope, close) {

        $scope.close = function(result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

    })

.controller('ConfirmationModalController', function($scope, close) {

        $scope.close = function(result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

    })
    .controller('ConfirmationModal',
        function($scope, $location, $element, session, sessionToken, title, close) {

            $scope.title = title;
            $scope.confirm = function() {
                console.log(this.code);
                session.activate(this.code)
                    .success(function(data) {
                        console.log(data);
                        sessionToken.setToken('userImage', data.profile.image);
                        sessionToken.setToken('userName', data.profile.name);
                        sessionToken.setToken('userEmail', data.profile.email);
                        sessionToken.setToken('userId', data.profile.id);
                        sessionToken.setToken('userDob', data.profile.dob);
                        sessionToken.setToken('userAddress', data.profile.address);
                        sessionToken.setToken('userInsid', data.profile.in_id);
                        sessionToken.setToken('userGender', data.profile.gender);
                        sessionToken.setToken('userNationality', data.profile.nationality);
                        $element.modal('hide');
                        $scope.close();
                        // close, but give 500ms for bootstrap to animate
                        close({ code: $scope.code }, 500);
                        $location.path('/');
                    }).then(function() {
                        location.reload();
                    });

                // CompController
            };
            //  This close function doesn't need to use jQuery or bootstrap, because
            //  the button has the 'data-dismiss' attribute.
            $scope.close = function() {
                // close, but give 500ms for bootstrap to animate
                close({}, 500);


            };
        }
    )

.controller('NewUserModalController',

        function($scope, $element, title, close) {

            $scope.title = title;

            //  This close function doesn't need to use jQuery or bootstrap, because
            //  the button has the 'data-dismiss' attribute.
            $scope.close = function() {
                close({

                }, 500); // close, but give 500ms for bootstrap to animate
            };

            //  This cancel function must use the bootstrap, 'modal' function because
            //  the doesn't have the 'data-dismiss' attribute.
            $scope.cancel = function() {

                //  Manually hide the modal.
                $element.modal('hide');

                //  Now call close, returning control to the caller.
                close({
                    name: $scope.UserForm.fullName,
                    email: $scope.UserForm.email,
                    insId: $scope.UserForm.insId
                }, 500); // close, but give 500ms for bootstrap to animate
            };

        }
    )
    .controller('MessageModalController',

        function($scope, $element, title, close) {

            $scope.title = title;

            //  This close function doesn't need to use jQuery or bootstrap, because
            //  the button has the 'data-dismiss' attribute.
            $scope.close = function() {
                close({

                }, 500); // close, but give 500ms for bootstrap to animate
            };

            //  This cancel function must use the bootstrap, 'modal' function because
            //  the doesn't have the 'data-dismiss' attribute.
            $scope.cancel = function() {

                //  Manually hide the modal.
                $element.modal('hide');

                //  Now call close, returning control to the caller.
                close({
                    msg: $scope.msgForm.msg

                }, 500); // close, but give 500ms for bootstrap to animate
            };

        }
    )
    .controller('EventDetailController',

        function($scope, $element, title, data, close) {

            $scope.title = title;
            $scope.author_email = data;
            $scope.event = data.event;
            $scope.event_disc = data.event_disc;
            $scope.date_time = data.date_time;
            $scope.end_time = data.end_time;
            $scope.sub_end = data.sub_end;
            $scope.host = data.host;

            //  This close function doesn't need to use jQuery or bootstrap, because
            //  the button has the 'data-dismiss' attribute.
            $scope.close = function() {
                close({

                }, 500); // close, but give 500ms for bootstrap to animate
            };

            //  This cancel function must use the bootstrap, 'modal' function because
            //  the doesn't have the 'data-dismiss' attribute.
            $scope.cancel = function() {

                //  Manually hide the modal.
                $element.modal('hide');

                //  Now call close, returning control to the caller.
                close({

                }, 500); // close, but give 500ms for bootstrap to animate
            };

        })
    .controller('ForgetPasswordModalController', function($scope, $location, $element, session, sessionToken, title, email, close) {

        $scope.title = title;
        $scope.email = email;
        $scope.access = function() {
            this.processing = true;
            this.error = '';
            this.isDisabled = true;

            //use session services to do authentication 
            //use user email and paswoerd for authentication
            session.authenticate($scope.email, this.tempPassword)
                // get the premise data if user is authenticated
                .success(function(data) {
                    this.processing = false;
                    session.getUser()
                        .then(function(data) {
                            console.log(data);
                            this.user = data.data;
                        });
                    //if user is authenticated successfully change the route
                    if (data.success) {
                        console.log(data);
                        console.log(data.profile.image);
                        console.log(data.profile.name);

                        sessionToken.setToken('userImage', data.profile.image);
                        sessionToken.setToken('userName', data.profile.name);
                        sessionToken.setToken('userEmail', data.profile.email);
                        sessionToken.setToken('userId', data.profile.id);
                        sessionToken.setToken('userDob', data.profile.dob);
                        sessionToken.setToken('userAddress', data.profile.address);
                        sessionToken.setToken('userGender', data.profile.gender);
                        sessionToken.setToken('userInsid', data.profile.in_id);
                        sessionToken.setToken('userNationality', data.profile.nationality);

                        $scope.close();
                        $location.path('/');
                        location.reload();
                        //else report user  error
                    } else {
                        this.error = data.message;
                        this.message = data.message;
                        console.log(data.message);

                    }
                });


        };
        //  This close function doesn't need to use jQuery or bootstrap, because
        //  the button has the 'data-dismiss' attribute.
        $scope.close = function() {
            // close, but give 500ms for bootstrap to animate
            close({}, 500);


        };
    })
    /**********************************************************************************************************/
    /***Test modals congrollers for more info about this bars just route to /test */

.controller('ModalController', function($scope, close) {

        this.close = function(result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

    })
    .controller('YesNoController', ['$scope', 'close', function($scope, close) {

        $scope.close = function(result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

    }])
    .controller('CustomController', ['$scope', 'close', function($scope, close) {

        $scope.close = close;

    }])

.controller('ComplexController', [
    '$scope', '$element', 'title', 'close',
    function($scope, $element, title, close) {

        $scope.name = null;
        $scope.age = null;
        $scope.title = title;

        //  This close function doesn't need to use jQuery or bootstrap, because
        //  the button has the 'data-dismiss' attribute.
        $scope.close = function() {
            close({
                name: $scope.name,
                age: $scope.age
            }, 500); // close, but give 500ms for bootstrap to animate
        };

        //  This cancel function must use the bootstrap, 'modal' function because
        //  the doesn't have the 'data-dismiss' attribute.
        $scope.cancel = function() {

            //  Manually hide the modal.
            $element.modal('hide');

            //  Now call close, returning control to the caller.
            close({
                name: $scope.name,
                age: $scope.age
            }, 500); // close, but give 500ms for bootstrap to animate
        };

    }
]);

/**********************************************************************************************************/

/**************************************************************************** */