 //Events controller

 /**************************************************************************** */
 /**
  * @Dependencies $scope, eventsService, sessionToken, user, session, ModalService
  */
 angular.module('eventsController', ['eventsService'])

 .controller('EventsController', function($scope, eventsService, sessionToken, user, session, ModalService) {

         //is user logged in variable function
         this.loggedIn = session.isLoggedIn(),
             // get loged in username
             $scope.userName = sessionToken.getToken('userName'),
             // get loged in email
             $scope.userEmail = sessionToken.getToken('userEmail')
             //set is user chattin setting to false initialy
         $scope.chat = false,
             //set  all acitve  events setting to true initialy
             $scope.activeOnes = true,
             //set  all is user Updating  events setting to true initialy
             $scope.isUpdating = true,
             //set  all is user Updating  events setting to true initialy
             $scope.isAddding = true,
             //list of all users holder variable
             $scope.Allusers,
             //list of all tasks holder variable
             $scope.AllTasks,
             //list of all events holder variable
             $scope.AllEvent,
             //sever messages variable holder
             $scope.message = "";
         //paper json data 
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
         //events options data
         this.eventOptionData = {
             title: "Add Event ",
             id: 0,
             event: "Event",
             event_disc: "Event Discription ... ",
             date_time: "Start Date ",
             end_time: "End Date ",
             sub_end: "Submission Date ",
             host: "Admin ",
             isNew: false,
         };
         //events message data 
         this.eventMessageData = {
                 title: "",
                 message: "",
                 event_id: 0,
                 to: ""

             }
             //user send to json data
         this.idToDeleteData = {
             _id: "0"
         };


         //format javascript date to  mm-dd-yy
         /**
          * @name formatDate
          * @param date javascript  date
          */
         this.formatDate = function(date) {
             return new Date(date).toString().split(" ").slice(0, 4).join(" ");
         }

         //get list off all users
         user.getAllUsers()
             .success(function(data) {
                 console.log(data);
                 $scope.Allusers = data;
             });
         // get list of all Events
         eventsService.AllEvents().success(function(data) {
             console.log("this Events");
             console.log(data);
             $scope.AllEvent = data;
             $scope.formatAllEvents(data);
         });
         //get list of all users
         eventsService.AllTasks().success(function(data) {
             console.log(data)
             $scope.AllTasks = data;

         });

         //format all events function
         /**
          * @name formatAllEvents
          * $param data json data of all evetns
          */
         $scope.formatAllEvents = function(data) {
             $scope.AllEvent = data;

             for (var i in data) {
                 $scope.AllEvent[i].end_time = new Date($scope.AllEvent[i].end_time).toString().split(" ").slice(0, 4).join(" ");
                 $scope.AllEvent[i].date_time = new Date($scope.AllEvent[i].date_time).toString().split(" ").slice(0, 4).join(" ");
                 $scope.AllEvent[i].sub_end = new Date($scope.AllEvent[i].sub_end).toString().split(" ").slice(0, 4).join(" ");
             }
         };

         //view details of task function
         /**
          * @name viewTaskInDetail
          * $param data json data of all Tasks
          */
         this.viewTaskInDetail = function(data) {

             this.showTasksModal(data);

         };
         //send Envitation to users function
         /**
          * @name sendEnvitation
          * $param event json data of selected event
          */
         this.sendEnvitation = function(event) {

             this.showUserListModal({ event: event, data: $scope.Allusers });
         };
         //send Envitation to users function
         /**
          * @name showDetailed
          * $param _id event id, 
          * $param event event name, 
          * $param  event_disc  event discription, 
          * $param  date_time event data, 
          *  $param opened is event ope or closed,  
          *  $param   host event host.
          *  sub_end evnet paper submission date
          *  $param   end_time  event over date.
          */
         this.showDetailed = function(_id, event, event_disc, date_time, opened, host, sub_end, end_time) {

             this.eventOptionData.title = "Events Details";

             this.eventOptionData.isNew = true;
             this.eventOptionData.id = _id;
             this.eventOptionData.event = event;
             this.eventOptionData.event_disc = event_disc;
             this.eventOptionData.date_time = this.formatDate(date_time);
             this.eventOptionData.end_time = this.formatDate(end_time);
             this.eventOptionData.sub_end = this.formatDate(sub_end);
             this.eventOptionData.host = host;
             this.showEventDetailsModal(this.eventOptionData);
         };
         //send update Event  function
         /**
          * @name showDetailed
          * $param _id event id, 
          * $param event event name, 
          * $param  event_disc  event discription, 
          * $param  date_time event data, 
          *  $param opened is event ope or closed,  
          *  $param   host event host.
          *  sub_end evnet paper submission date
          *  $param   end_time  event over date.
          */
         this.updateEvent = function(_id, event, event_disc, date_time, opened, host, sub_end, end_time) {
             // $scope.isUpdating = true;
             // $scope.isAddding = false;
             console.log(_id + " " + event + " " + event_disc + " " + date_time + " " + opened + " " + host + " " + sub_end + " " + end_time);
             this.eventOptionData.isNew = false;
             this.eventOptionData.title = "Update Event";
             this.eventOptionData.id = _id;
             this.eventOptionData.event = event;
             this.eventOptionData.event_disc = event_disc;
             this.eventOptionData.date_time = this.formatDate(date_time);
             this.eventOptionData.end_time = this.formatDate(end_time);
             this.eventOptionData.sub_end = this.formatDate(sub_end);
             this.eventOptionData.host = host;
             console.log(this.eventOptionData);
             this.showEventsModal(this.eventOptionData);
         };


         /*****************************************************/
         /*** //show deatils of event modal
          * @showEventDetailsModal
          * @param datajson data of selected events
          */
         this.showEventDetailsModal = function(data) {

             ModalService.showModal({

                 templateUrl: "/views/pages/modals/eventsDetailModal.html",

                 controller: "EventDetailController",
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
         /*****************************************************/
         /*** //show add event modal
          * @showTasksModal
          * @param datajson data of selected events
          */
         this.showTasksModal = function(data) {

             ModalService.showModal({

                 templateUrl: "/views/pages/modals/taskModal.html",

                 controller: "TaskModalController",
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


         /*****************************************************/
         /*** //show  //send Message modal
          * @showTasksModal
          * @param email data email send to 
          * @param event_id event id
          */
         this.sendMessageToReviewr = function(email, event_id) {

             this.eventMessageData.title = "Send Event Invitation",
                 this.eventMessageData.message = "Message goes here",
                 this.eventMessageData.event_id = event_id,
                 this.eventMessageData.to = "someone@some.com";


             this.showMessageModal(this.eventMessageData);
         };
         /*****************************************************/
         //  /*****************************************************/
         //  //remove | Delete | Deactivate  user acount
         //  this.removeTask = function(id) {
         //      // this.idToDeleteData._id = id;
         //      this.showConfirmationYesNoTwo({ id: id });

         //  };
         //  /*****************************************************/
         //  /*****************************************************/
         //  //remove | Delete | Deactivate  user acount
         //  this.removeDeleteDeactivate = function(id) {
         //      this.idToDeleteData._id = id;

         //      this.showConfirmationYesNo(this.idToDeleteData);

         //  };
         /*****************************************************/
         /*****************************************************/
         /*** //show   Submission Details Modal to submit paper
          * @showSubmissionDetailsModal
          * @param event_name event name
          * @param paper_event paper event id
          */
         this.showSubmissionDetailsModal = function(event_name, paper_event) {

             var author_email = $scope.userName,
                 author_name = $scope.userEmail;

             ModalService.showModal({

                 templateUrl: "/views/pages/modals/papersModal.html",
                 controller: "SubmissionController",
                 inputs: {
                     title: "Submit Paper",
                     author_email: author_email,
                     author_name: author_name,
                     paper_event: paper_event,
                     event_key_words: "Key Words",
                     event_name: event_name

                 }
             }).then(function(modal) {
                 modal.element.modal();
                 modal.close.then(function(result) {

                 });
             });

         };

         /*****************************************************/

         /*****************************************************/
         //activate user acount
         /*** add new event
          * @name addNewEvent
          * 
          */
         this.addNewEvent = function() {

             this.eventOptionData.id = "",
                 this.eventOptionData.event = "Event",
                 this.eventOptionData.event_disc = "Event Discription ... ",
                 this.eventOptionData.date_time = "Start Date",
                 this.eventOptionData.end_time = "End Date ",
                 this.eventOptionData.sub_end = "End of Review Submission Date";
             // $scope.isUpdating = false;
             // $scope.isAddding = true;
             this.eventOptionData.isNew = true;
             this.eventOptionData.title = "New Event"
             console.log(this.eventOptionData);
             this.showEventsModal(this.eventOptionData);

         };
         /*****************************************************/

         /*****************************************************/
         /**yes no confirmation modal **
          * @name showConfirmationYesNoTwo
          * @param data confirmation statement
          */
         this.showConfirmationYesNoTwo = function(data) {

             ModalService.showModal({
                 templateUrl: "/views/pages/modals/confirmationMadal.html",
                 controller: "ConfirmationModalControllerTwo",


             }).then(function(modal) {
                 modal.element.modal();
                 modal.close.then(function(result) {
                     console.log(result);
                     if (result) {
                         eventsService.deleterTask(data)
                             .then(function(res) {
                                 eventsService.AllEvents().success(function(data) {
                                     console.log(data)

                                     $scope.formatAllEvents(data);
                                 });

                             }, function(error) {
                                 $scope.message = error;
                             });
                     }


                 });
             });


         };
         /*****************************************************/
         /*****************************************************/
         /**yes no confirmation modal variant**
          * @name showConfirmationYesNo
          * @param data confirmation statement
          */
         this.showConfirmationYesNo = function(data) {

             ModalService.showModal({
                 templateUrl: "/views/pages/modals/confirmationMadal.html",
                 controller: "ConfirmationModalController",
                 inputs: {
                     title: "do  you want to close conferece ?",
                 }


             }).then(function(modal) {
                 modal.element.modal();
                 modal.close.then(function(result) {
                     console.log(result);
                     if (result) {
                         // var data = { id: id }
                         console.log(data);
                         eventsService.deleterTask(data)
                             .then(function(res) {
                                 eventsService.AllEvents().success(function(data) {
                                     console.log(data)
                                     $scope.AllEvent = data;
                                 });

                             }, function(error) {
                                 $scope.message = error;
                             });

                     }

                 });
             });


         };
         /*****************************************************/

         /*****************************************************/
         /** showUser ListModal modal variant**
          * @name showUserListModal
          * @param data selected user json data
          */
         this.showUserListModal = function(data) {

             ModalService.showModal({

                 templateUrl: "/views/pages/modals/userslistModal.html",

                 controller: "UserListController",
                 inputs: {
                     title: "Assign Task",
                     data: data
                 }
             }).then(function(modal) {
                 modal.element.modal();
                 modal.close.then(function(result) {

                 });
             });

         };

         /*****************************************************/

         /*****************************************************/
         /**  show Message Modal   **
          * @name showMessageModal
          * @param eventMessageData event message
          */
         this.showMessageModal = function(eventMessageData) {

             ModalService.showModal({

                 templateUrl: "/views/pages/modals/sendEventInvitation.html",

                 controller: "MessageModalController",
                 inputs: {
                     title: eventMessageData.title,

                     msgForm: {
                         title: eventMessageData.title,
                         message: eventMessageData.message,
                         event_id: eventMessageData.event_id,
                         to: eventMessageData.to

                     }
                 }
             }).then(function(modal) {
                 modal.element.modal();
                 modal.close.then(function(result) {
                     console.log(result);
                     if (result.result) {
                         if (result.to != null || result.to != "" || result.to != "someone@some.com") {

                             result.message += "<br/> Use this: " + eventMessageData.event_id + " Event code to send your papares ";
                             eventsService.sendInvitation(result);
                         }
                     }
                 });

             });

         };
         /****************************************************** */

         /****************************************************** */
         /*****************************************************/
         /**  show detals of Events Modal   **
          * @name showEventsModal
          * @param eventOptionData seleted event
          */
         this.showEventsModal = function(eventOptionData) {

             ModalService.showModal({

                 templateUrl: "/views/pages/modals/eventsFormModal.html",

                 controller: "EventsModalController",
                 inputs: {
                     title: eventOptionData.title,
                     isNew: eventOptionData.isNew,

                     eventsForm: {
                         id: eventOptionData.id,
                         event: eventOptionData.event,
                         event_disc: eventOptionData.event_disc,
                         date_time: eventOptionData.date_time,
                         end_time: eventOptionData.end_time,
                         sub_end: eventOptionData.sub_end,
                     }

                 }
             }).then(function(modal) {
                 modal.element.modal();
                 modal.close.then(function(result) {
                     if (result.result) {

                         if (eventOptionData.isNew)
                             eventsService.registerEvent(result);
                         else
                             eventsService.updateEvent(result);

                         eventsService.AllEvents().success(function(data) {

                             $scope.formatAllEvents(data);

                         });


                         this.eventOptionData.event = "Event",
                             this.eventOptionData.event_disc = "Event Discription ... ",
                             this.eventOptionData.date_time = "Start Date",
                             this.eventOptionData.end_time = "End Date ",
                             this.eventOptionData.sub_end = "End of Review Submission Date";
                     }

                     console.log(result.result);

                 });
             });

         };

     })
     /****************************************************** */
     /** Submission modal controller
      * @Dependencies $scope, $element, title, event_key_words, eventsService, event_name, author_email, author_name, paper_event, close
      */
     .controller('SubmissionController',

         function($scope, $element, title, event_key_words, eventsService, event_name, author_email, author_name, paper_event, close) {

             $scope.title = title;
             $scope.author_email = author_email;
             $scope.author_name = author_name;
             $scope.paper_event = paper_event;
             $scope.event_key_words = event_key_words;
             $scope.event_name = event_name;
             $scope.keyWords = [];
             $scope.isKeyWordsEmpty = true;
             $scope.message = "";

             $scope.proccessing = false;
             $scope.submitPaper = function() {
                 if (($scope.event_id != "" || $scope.event_id != null) ||
                     ($scope.filePdf.name != "" || $scope.filePdf.name != null || $scope.filePdf != null)) {

                     var keyWords = $scope.keyWords.toString().replace(",", " ");
                     data = {
                         auther_name: author_name,
                         auther_email: author_email,
                         paper_disc: $scope.papeForm.paper_disc,
                         paper_event: event_name,
                         event_id: $scope.papeForm.event_id,
                         key_words: keyWords
                     }

                 };
                 $scope.readFile($scope.filePdf, data);


             };

             //  console.log(data);
             //  console.log($scope.filePdf.name);
             $scope.readFile = function(file, data) {
                 var reader = new FileReader();
                 reader.addEventListener("loadend", function(evt) {

                     eventsService.submitPaper({ data: data, file: reader.result })
                         .then(function(response) {
                             console.log(response.data.url);


                             $scope.proccessing = false;
                         });

                 })

                 reader.readAsDataURL(file);

             };

             $scope.removeAll = function() {
                 for (var i = 0; i <= $scope.keyWords.length; i++)
                     $scope.keyWords.splice(i, 1);
                 $scope.keyWords = [];

                 $scope.isKeyWordsEmpty = true;
             };
             $scope.removeKeyWord = function(event_key_words) {
                 console.log(event_key_words);
                 for (var i = 0; i <= $scope.keyWords.length; i++)
                     if (event_key_words == $scope.keyWords[i])
                         $scope.keyWords.splice(i, 1);

                 if ($scope.keyWords.length == 0) $scope.isKeyWordsEmpty = true;
             };



             $scope.addKeyWords = function(event_key_words, event) {
                 var exist = false;
                 if ((event.keyCode == 13 || event.keyCode == 32) && event_key_words != "") {

                     for (var i = 0; i <= $scope.keyWords.length; i++)
                         if ($scope.keyWords == event_key_words[i])
                             exist = true;
                     if (!exist) {
                         $scope.isKeyWordsEmpty = false;
                         $scope.keyWords.push(event_key_words);
                         $('#key_words').val('');
                     }
                 }



             };

             // this.paperOptionData = {
             //     auther_name: " ",
             //     auther_email: " ",
             //     reviewer_email: " ",
             //     paper_disc: " ",
             //     paper_event: " ",
             //     event_id: " ",
             //     paper: "",
             //     reviewer_expertise: " ",
             //     overall_evaluation: " ",
             //     summary: " ",
             //     strong_popints: " ",
             //     weak_points: " "
             // };


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
                     event: $scope.eventsForm.event,
                     discription: $scope.eventsForm.eventDiscription,
                     date: $scope.eventsForm.eventDate
                 }, 500); // close, but give 500ms for bootstrap to animate
             };

         }
     )
     /****************************************************** */
     /** Events Detail   modal controller
      * @Dependencies $scope, $element, title, data, close
      */
     .controller('EventDetailController',

         function($scope, $element, title, data, close) {

             $scope.title = data.title;
             $scope.id = data.id;
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
     .controller('TaskModalController',

         function($scope, $element, title, data, close) {

             $scope.sub_id = data.sub_id;
             $scope.reviewr = data.reviewr;
             $scope.status = data.status;
             $scope.rank = data.rank;
             $scope.feedback = data.feedback;

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
     /** Users List  modal controller
      * @Dependencies $scope, $element, title, data, eventsService, close
      */
     .controller('UserListController',

         function($scope, $element, title, data, eventsService, close) {

             $scope.title = title;
             $scope.Allusers = data.data;
             $scope.event_id = data.sub_id
             var message = "You have been Invited to::" + data.event.event +
                 ":: conference" + " use this <u><b>" + data.event._id + "</b></u> access code to send your papers"
             var selecteUser;
             $scope.selectedEmails = [];
             $scope.selected = false;

             $scope.removeallList = function() {
                 $scope.selectedEmails = [];
                 $scope.selected = false;
             };

             $scope.send = function() {

                 eventsService.sendEnvitation({ emails: $scope.selectedEmails, message: message });

             };

             $scope.removeSelectedEmail = function(email) {
                 if ($scope.selectedEmails.length == 1) {
                     $scope.selectedEmails.pop();
                     $scope.selected = false;
                 }

                 if ($scope.mulitSelectedEmails.length > 1) {
                     for (var i in $scope.selectedEmails) {
                         var obj = $scope.selectedEmails[i];
                         if (obj.email == email) {
                             $scope.selectedEmails.splice(i, 1);
                         }
                     }
                 }

             };


             $scope.selectUser = function(selectedEmail) {
                 $scope.selected = true;
                 var exists = false;
                 console.log($scope.selectedEmails);
                 if ($scope.selectedEmails.length == 0) {
                     exists = false;
                 } else {

                     for (var i in $scope.selectedEmails) {
                         var obj = $scope.selectedEmails[i];
                         if (obj.email == selectedEmail) {
                             if (obj.email == selectedEmail) {
                                 exists = true;
                             }
                         }
                     }
                 }
                 if (exists == false)
                     $scope.selectedEmails.push({ "email": selectedEmail });
             };



             $scope.sendInvitation = function(user) {
                 selecteUser = $scope.selectedEmails;
                 $element.modal('hide');
                 $scope.close();

             };
             //  This close function doesn't need to use jQuery or bootstrap, because
             //  the button has the 'data-dismiss' attribute.
             $scope.close = function() {
                 close({
                     user: selecteUser
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
     /**   Confirmation Modal Controlle modal controller
      * @Dependencies $scope, $element, title, close
      */
     .controller('ConfirmationModalControllerTwo', function($scope, $element, title, close) {
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
     /**   Confirmation Modal   modal controller
      * @Dependencies $scope, $element, close
      */
     .controller('ConfirmationModalController', function($scope, $element, close) {


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
 /**   MessageModal modal controller
  * @Dependencies $scope, $element, msgForm, title, close
  */
 .controller('MessageModalController',

         function($scope, $element, msgForm, title, close) {

             $scope.title = title;
             $scope.msgForm = msgForm;
             //  This close function doesn't need to use jQuery or bootstrap, because
             //  the button has the 'data-dismiss' attribute.
             $scope.close = function() {
                 close({
                     message: $scope.msgForm.msg,
                     event_id: $scope.msgForm.event_id,
                     to: $scope.msgForm.to,
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

         }
     )
     /****************************************************** */
     /**   EventsModal  modal controller
      * @Dependencies $scope, $element, title, eventsForm, isNew, close
      */
     .controller('EventsModalController',

         function($scope, $element, title, eventsForm, isNew, close) {
             var todaysdate = String(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate());
             console.log(todaysdate);
             $scope.title = title;
             $scope.eventsForm = eventsForm;
             $scope.isNew = isNew;
             console.log(eventsForm);
             $scope.today = todaysdate;

             // <!--event_disc: "Event Discription ... ", date_time: "Start Date ", end_time: "End Date ", sub_end: "Submission Date ", host: "Admin ", isNew: false,-->

             //  This close function doesn't need to use jQuery or bootstrap, because
             //  the button has the 'data-dismiss' attribute.
             $scope.close = function() {
                 close({
                     id: $scope.eventsForm._id || eventsForm._id,
                     host: $scope.eventsForm.host || eventsForm.host,
                     event: $scope.eventsForm.event || eventsForm.event,
                     event_disc: $scope.eventsForm.eventDiscription || eventsForm.event_disc,
                     date_time: $scope.eventsForm.date_time || eventsForm.date_time,
                     end_date: $scope.eventsForm.end_date || eventsForm.end_date,
                     sub_end: $scope.eventsForm.sub_end || eventsForm.sub_end,
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
                         // id: $scope.eventsForm.id,
                         // event: $scope.eventsForm.event,
                         // event_disc: $scope.eventsForm.eventDiscription || $scope.eventsForm.event_disc,
                         // date_time: $scope.eventsForm.eventDate || $scope.eventsForm.date_time
                 }, 500); // close, but give 500ms for bootstrap to animate
             };

         }
     );