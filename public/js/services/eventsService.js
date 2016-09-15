// sessionService
/**************************************************************************** */
/**
 * Dependencies
 *  $http,$$q ,sessionToken  submitPaper
 */


angular.module('eventsService', [])
    .factory('eventsService', function($http, $q) {
        //eventsService object :: empty 
        var eventsService = {};
        //sevice return messages
        eventsService.message = "";
        /*****************************************************/
        // eventsService getMessage member method :: get all messages  
        /**
         * @name getMessage
         *  
         * 
         * */
        eventsService.getMessage = function() {
            return eventsService.message;
        };

        eventsService.uploadPapers = function(file, errFiles) {


        };
        /*****************************************************/
        // eventsService submitPaper member method ::   submit papers
        /**
         * @name submitPaper
         * @Param data json data to be sent to the server
         * 
         * */
        eventsService.submitPaper = function(data) {
            // console.log(data);
            return $http.post('/services/tasks', data)

            //if successfull  return  expose the data for calling function
            .success(function(data) {
                eventsService.message = data.message;
                return data;
            });

            //if successfull  return  expose the data for calling function
        };
        /*****************************************************/
        /*****************************************************/
        // eventsService sendEnvitation member method :: send Envitation to users
        /**
         * @name sendEnvitation
         * @Param data json data to be sent to the server
         * 
         * */
        eventsService.sendEnvitation = function(data) {
            // console.log(data);
            return $http.post('/services/papers', { data: data, task: "envitation" })

            //if successfull  return  expose the data for calling function
            .success(function(data) {
                eventsService.message = data.message;
                return data;
            });

        };
        /*****************************************************/

        /*****************************************************/
        // eventsService assignTask member method ::  assign Task to users
        /**
         * @name assignTask
         * @Param data json data to be sent to the server
         * 
         * */
        eventsService.assignTask = function(data) {
            // console.log(data);
            return $http.post('/services/papers', data)

            //if successfull  return  expose the data for calling function
            .success(function(data) {
                eventsService.message = data.message;
                return data;
            });

            //if successfull  return  expose the data for calling function
        };
        /*****************************************************/

        /*****************************************************/
        // eventsService getAllEvetns member method :: get all evetns  
        /**
         * @name AllTasks
         * 
         * */
        eventsService.AllTasks = function() {

            return $http.get('/services/papers');
            //   url: '/services/papers/',
            //if successfull  return  expose the data for calling function
        };
        /*****************************************************/

        /*****************************************************/
        // eventsService deleteEvent member method :: delete an event
        /**
         * @name deleterTask
         * @data json data to be sent to the server
         * */
        eventsService.deleterTask = function(data) {
            return $http({
                url: '/services/events/',
                method: 'DELETE',
                data: data,
                headers: { "Content-Type": "application/json;charset=utf-8" }
            })

        };
        /*****************************************************/

        /*****************************************************/
        // eventsService getAllEvetns member method :: get all evetns  
        /**
         * @name AllEvents
         * */
        eventsService.AllEvents = function() {

            return $http.get('/services/events');
        };
        /*****************************************************/
        /*****************************************************/
        // eventsService registerEvent member method :: add an event
        /**
         * @name registerEvent
         * @event json data to be sent to the server
         * */

        eventsService.registerEvent = function(event) {
            return $http.post('/services/events', event)
                //if successfull  return  expose the data for calling function
                .success(function(data) {
                    eventsService.message = data.message;
                    return data;
                });

        };
        /*****************************************************/

        /*****************************************************/
        // eventsService deleteEvent member method :: delete an event
        /**
         * @name deleterEvent
         * @event json data to be sent to the server
         * */
        eventsService.deleterEvent = function(event) {
            return $http({
                url: '/services/events/',
                method: 'DELETE',
                data: event,
                headers: { "Content-Type": "application/json;charset=utf-8" }
            })

        };
        /*****************************************************/

        /*****************************************************/
        // eventsService deleteEvent member method :: delete an event
        /**
         * @name updateEvent
         * @event json data to be sent to the server
         * */
        eventsService.updateEvent = function(event) {
            return $http.put('/services/events/', event)
                //if successfull  return  expose the data for calling function
                .success(function(data) {
                    eventsService.message = data.message;
                    return data;
                });

        };
        /*****************************************************/

        /*****************************************************/
        // eventsService sendInvitation member method :: send an event invitation variant method

        /**
         * @name sendInvitation
         * @event json data to be sent to the server
         * */
        eventsService.sendInvitation = function(event) {
            return $http.post('/services/sendinvitation/', event)
                //if successfull  return  expose the data for calling function
                .success(function(data) {
                    eventsService.message = data.message;
                    return data;
                });

        };
        /*****************************************************/






        return eventsService;
    });