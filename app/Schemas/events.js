 /**************************************************************************** */
 //monogos  mongoDB schema and api freamework
 var mongoose = require('mongoose');
 // construct defualt mongo Schema
 var Schema = mongoose.Schema;
 /**************************************************************************** */

 /****************************************************************************/
 //Events schema
 var eventsSchema = new Schema({
     event: { type: String, required: true },
     event_disc: { type: String, required: false },
     date_time: { type: Date, required: true },
     end_time: { type: Date, required: true, default: Date.now },
     sub_end: { type: Date, required: true, default: Date.now },
     host: { type: String, default: "admin" },
     opened: { type: Boolean, default: true }
 });
 /****************************************************************************/
 //export the schma to be used.
 module.exports = mongoose.model('Event', eventsSchema);