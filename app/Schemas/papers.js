/**************************************************************************** */
//monogos  mongoDB schema and api freamework
var mongoose = require('mongoose');
// construct defualt mongo Schema
var Schema = mongoose.Schema;
/**************************************************************************** */

/****************************************************************************/
//Paper schema
var paperSchema = new Schema({

    auther_name: { type: String, required: true },
    auther_email: { type: String, required: true },
    reviewer_email: { type: String, required: false },
    paper_disc: { type: String, required: true },
    paper_event: { type: String, required: true },
    event_id: { type: String, required: true },
    paper: { type: String, required: true },
    reviewer_expertise: { type: String, required: true },
    overall_evaluation: { type: String, required: true },
    summary: { type: String, required: true },
    strong_popints: { type: String, required: true },
    key_words: { type: String, required: false },
    weak_points: { type: String, required: true },
    open: { type: Boolean, default: false }

});
/****************************************************************************/
//export the schma to be used.
module.exports = mongoose.model('Paper', paperSchema);