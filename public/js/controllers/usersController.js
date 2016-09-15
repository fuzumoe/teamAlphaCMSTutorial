//user Controller

/**************************************************************************** */
/**
 * @Dependencie $scope, user, session, ModalService
 */
angular.module('userController', ['profileService'])

.controller('UserController', function($scope, user, session, ModalService) {
        //list of all users
        $scope.Allusers;
        //set is user chattin setting to false initialy
        $scope.chat = true;
        //selected email array
        $scope.mulitSelectedEmails = [];
        // is any email selected variable
        this.selected = false;
        //remove all selected emails function
        this.removeallList = function() {
                $scope.mulitSelectedEmails = [];

                this.selected = false;
            }
            //add  email to selected emails array
        this.selectUser = function(selectedEmail) {
            this.selected = true;
            var exists = false;
            console.log($scope.mulitSelectedEmails);
            if ($scope.mulitSelectedEmails.length == 0) {
                exists = false;
            } else {

                for (var i in $scope.mulitSelectedEmails) {
                    var obj = $scope.mulitSelectedEmails[i];
                    if (obj.email == selectedEmail) {
                        if (obj.email == selectedEmail) {
                            exists = true;
                        }
                    }
                }


            }
            if (exists == false)
                $scope.mulitSelectedEmails.push({ "email": selectedEmail });
        };

        //remove duplicate emails from list of selected emails arrayfunction
        this.removeSelectedEmail = function(email) {


            if ($scope.mulitSelectedEmails.length == 1) {
                $scope.mulitSelectedEmails.pop();
                this.selected = false;

            }

            if ($scope.mulitSelectedEmails.length > 1) {
                for (var i in $scope.mulitSelectedEmails) {
                    var obj = $scope.mulitSelectedEmails[i];
                    if (obj.email == email) {
                        $scope.mulitSelectedEmails.splice(i, 1);
                    }
                }

            }

        };

        //is user active function
        /*****************************************************/
        /** get all of profile variables
         * @name isActive
         * */

        this.isActive = function(bolVal) {

            console.log(bolVal);
            return bolVal;
        }

        //get list of all users

        user.getAllUsers()
            .success(function(data) {
                console.log(data);
                $scope.Allusers = data;
            });

        /*****************************************************/
        /**
         * add new User *
         * @name addUser 
         */
        this.addUser = function() {
            this.showNewUserModal();
        };

        /*****************************************************/
        /**
         * add Show user details
         * @name showUserDetails 
         * @param file file to be red and converted
         * @param data data to be sent with binary data
         * 
         */
        this.showUserDetails = function(data) {
            this.showUserDetailsModal(data);
        };

        /*****************************************************/
        /**
         * add Deactivate or activate user*
         * @name removeDeleteDeactivate 
         * @param userEmail USER EMAIL
         * @param option  boolean activate/deactivate
         * 
         */
        this.removeDeleteDeactivate = function(userEmail, option) {
            this.showConfirmationYesNo({ email: userEmail, active: option });
        };
        /*****************************************************/
        /**
         * send Message to user
         * @name sendMessageto 
         * @param to USER EMAIL
         *  @param option message options
         * 
         */
        this.sendMessageto = function(to, option) {

            this.showMessageModal(to, option);
        };
        /*****************************************************/
        /**
         * send sendMessageto Multi users
         * @name sendMessageto 
         * @param to USERs EMAIL
         *  @param option message options
         * 
         */
        this.sendMessagetoMulti = function(to, option) {

            this.showMessageModalMulti($scope.mulitSelectedEmails, option);
        };
        /*****************************************************/
        /**
         * send show Message  Multi Modal     variant
         * @name showMessageModalMulti 
         * @param to USERs EMAIL
         *  @param option message options
         * 
         */
        this.showMessageModalMulti = function(to, option) {

            var emailTo = " ";
            for (var i in $scope.mulitSelectedEmails) {
                var obj = $scope.mulitSelectedEmails[i];
                emailTo = emailTo.concat(" ").concat(obj.email);
            }
            console.log(emailTo);

            ModalService.showModal({

                templateUrl: "/views/pages/modals/sendEmailMessagModal.html",

                controller: "MessageEmailModalController",
                inputs: {
                    title: "Send Email Message",

                    msgForm: {
                        subject: " ",
                        message: " ",
                        to: emailTo,
                        multi: option
                    }
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {

                    console.log(result);

                    if (result.subject && result.message)

                        user.sendMessageToSelectedOnes(result);

                    else console.log('please provide all input data')
                    $scope.mulitSelectedEmails = new Array({ "email": "bbb" });
                    $scope.mulitSelectedEmails.pop();


                });
            });

        };

        /*****************************************************/
        /*****************************************************/
        /**
         * send show Messag Modal     variant
         * @name showMessageModal 
         * @param to USERs EMAIL
         *  @param option message options
         * 
         */
        this.showMessageModal = function(to, option) {

            ModalService.showModal({

                templateUrl: "/views/pages/modals/sendEmailMessagModal.html",

                controller: "MessageEmailModalController",
                inputs: {
                    title: "Send Email Message",

                    msgForm: {
                        subject: " ",
                        message: " ",
                        to: to,
                        multi: option
                    }
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {

                    console.log(result);

                    if (result.subject && result.message)
                        user.sendMessage(result);
                    else console.log('please provide all input data')

                });
            });

        };
        /****************************************************** */
        /*****************************************************/
        /**yes no confirmation modal **
         * @name showConfirmationYesNoTwo
         * @param data confirmation statement
         */
        this.showConfirmationYesNo = function(data) {
            var title = (data.active == true) ? "Activate" : "Deactivate";
            ModalService.showModal({
                templateUrl: "/views/pages/modals/confirmationMadal.html",
                controller: "ConfirmationModalController",
                inputs: {
                    title: "do  you want to " + title + " user ?",
                }

            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    console.log(result);
                    if (result) {
                        console.log(data);
                        user.updateUser(data);
                        user.getAllUsers()
                            .success(function(data) {
                                console.log(data);
                                $scope.Allusers = data;
                            });
                    }

                });
            });


        };
        /*****************************************************/
        /*****************************************************/
        /**show NewUser Modal**
         * @name showNewUserModal
         */
        this.showNewUserModal = function() {

            ModalService.showModal({

                templateUrl: "/views/pages/modals/newUserModal.html",

                controller: "NewUserModalController",
                inputs: {
                    title: "New User"
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    // $scope.newUserName = result.name;
                    // $scope.newUserEmail = result.email;
                    // $scope.newUserInsId = result.insId;
                    console.log(result);
                    user.createUser(result);


                });
            });

        };

        /*****************************************************/
        /**show User Details Modal **
         * @name showUserDetailsModal
         * @param data seleted user data
         */
        this.showUserDetailsModal = function(data) {

            ModalService.showModal({

                templateUrl: "/views/pages/modals/userDetailsModal.html",

                controller: "UserDetailController",
                inputs: {
                    title: "Assign Task To Selected User",
                    data: data
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {



                });
            });

        };

        /*****************************************************/
    })
    /****************************************************** */
    /** Message Email Modal Controller
     * @Dependencies $scope, $element, msgForm, title, close
     */
    .controller('MessageEmailModalController',

        function($scope, $element, msgForm, title, close) {

            $scope.title = title;
            $scope.msgForm = msgForm;
            //  This close function doesn't need to use jQuery or bootstrap, because
            //  the button has the 'data-dismiss' attribute.
            $scope.close = function() {

                close({
                    message: $scope.msgForm.msg,
                    to: $scope.msgForm.to,
                    subject: $scope.msgForm.subject,
                    multi: $scope.msgForm.multi
                }, 500); // close, but give 500ms for bootstrap to animate
            };

            //  This cancel function must use the bootstrap, 'modal' function because
            //  the doesn't have the 'data-dismiss' attribute.
            $scope.cancel = function() {

                //  Manually hide the modal.
                $element.modal('hide');

                //  Now call close, returning control to the caller.
                close({
                    result: false
                        // message: $scope.msgForm.msg,
                        // event_id: $scope.msgForm.event_id,
                        // to: $scope.msgForm.to
                }, 500); // close, but give 500ms for bootstrap to animate
            };

        }
    )
    /****************************************************** */
    /** Confirmation Modal Controller
     * @Dependencies $scope, $element, title, close
     */
    .controller('ConfirmationModalController', function($scope, $element, title, close) {

        $scope.title = title;
        //  This close function doesn't need to use jQuery or bootstrap, because
        //  the button has the 'data-dismiss' attribute.
        $scope.close = function() {
            close({
                result: true
            }, 500); // close, but give 500ms for bootstrap to animate
        };

        //  This cancel function must use the bootstrap, 'modal' function because
        //  the doesn't have the 'data-dismiss' attribute.
        $scope.cancel = function() {

            //  Manually hide the modal.
            $element.modal('hide');

            //  Now call close, returning control to the caller.
            close({
                result: false
                    // message: $scope.msgForm.msg,
                    // event_id: $scope.msgForm.event_id,
                    // to: $scope.msgForm.to
            }, 500); // close, but give 500ms for bootstrap to animate
        };

    })
    /****************************************************** */
    /** User Detail Controller
     * @Dependencies $scope, $element, title, data, close
     */
    .controller('UserDetailController',

        function($scope, $element, title, data, close) {

            $scope.title = title;
            $scope.image = data.image;
            $scope.dob = data.dob;
            $scope.address = data.address;
            $scope.fullName = data.full_name;
            $scope.email = data.email;
            $scope.institute = data.in_id;

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

        }
    )
    /****************************************************** */
    /** New User Modal Controller
     * @Dependencies $scope, $element, title, close
     */
    .controller('NewUserModalController',

        function($scope, $element, title, close) {

            $scope.title = title;

            //  This close function doesn't need to use jQuery or bootstrap, because
            //  the button has the 'data-dismiss' attribute.
            $scope.close = function() {
                close({
                    full_name: $scope.newUserForm.full_name,
                    email: $scope.newUserForm.email,
                    insId: $scope.newUserForm.insId
                }, 500); // close, but give 500ms for bootstrap to animate
            };

            //  This cancel function must use the bootstrap, 'modal' function because
            //  the doesn't have the 'data-dismiss' attribute.
            $scope.cancel = function() {

                //  Manually hide the modal.
                $element.modal('hide');

                //  Now call close, returning control to the caller.
                close({
                    full_name: $scope.newUserForm.fullName,
                    email: $scope.newUserForm.email,
                    insId: $scope.newUserForm.insId
                }, 500); // close, but give 500ms for bootstrap to animate
            };

        }
    );