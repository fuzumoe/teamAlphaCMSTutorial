/**************************************************************************** */
//monogos  mongoDB schema and api freamework
var mongoose = require('mongoose');
// construct defualt mongo Schema
var Schema = mongoose.Schema;
/**************************************************************************** */

/****************************************************************************/
//Institution schema
var institutionSchema = new Schema({
    name: { type: String, required: true }
});
/****************************************************************************/
//export the schma to be used.
module.exports = mongoose.model('institution', institutionSchema);