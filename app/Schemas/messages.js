/**************************************************************************** */
//monogos  mongoDB schema and api freamework
var mongoose = require('mongoose');
// construct defualt mongo Schema
var Schema = mongoose.Schema;
/**************************************************************************** */

/****************************************************************************/
//Messages schema
var messagesSchema = new Schema({

    from: { type: String, required: true },
    to: { type: String, required: true },
    messge: { type: String, required: true }

});
/****************************************************************************/
//export the schma to be used.
module.exports = mongoose.model('Massage', messagesSchema);