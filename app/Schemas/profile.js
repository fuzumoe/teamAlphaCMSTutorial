/**************************************************************************** */
//monogos  mongoDB schema and api freamework
var mongoose = require('mongoose');
// construct defualt mongo Schema
var Schema = mongoose.Schema;
/**************************************************************************** */
/****************************************************************************/
//Profile schema
var ProfileSchema = new Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    in_id: { type: String, default: "... " },
    dob: { type: Date, default: Date.now },
    nationality: { type: String, default: "" },
    gender: { type: String, default: "" },
    address: { type: String, default: "... " },
    image: { type: String, default: "http://showreel.tv/sites/all/themes/showreel/images/default_user_icon_inverted.png" }
});
/**************************************************************************** */

//export the schma to be used.
module.exports = mongoose.model('Profile', ProfileSchema);