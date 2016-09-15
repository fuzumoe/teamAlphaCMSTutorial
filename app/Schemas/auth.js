/**************************************************************************** */
//monogos  mongoDB schema and api freamework
var mongoose = require('mongoose');
// construct defualt mongo Schema
var Schema = mongoose.Schema;
//bcrypt an js. encryption 
var bcrypt = require('bcrypt-nodejs');
/**************************************************************************** */


/**************************************************************************** */
//Auth schema
var AuthSchema = new Schema({
    pri: { type: String, default: "00" },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    active: { type: Boolean, default: false }
});
/**************************************************************************** */
/**************************************************************************** */
//encrypt password pre. save and save
AuthSchema.pre('save', function(next) {
    var auth = this;
    if (!auth.isModified('password')) return next();

    bcrypt.hash(auth.password, null, null, function(err, hash) {
        if (err) return next(err);
        auth.password = hash;
        next();
    });
});
/**************************************************************************** */
//password compare method
AuthSchema.methods.comparePassword = function(password) {
    var auth = this;
    return bcrypt.compareSync(password, auth.password);
};
/**************************************************************************** */
//export the schma to be used.
module.exports = mongoose.model('Auth', AuthSchema);

// http: //www.something.com/foo/bar/index.html?color=yellow

//http: //localhost:3000/home?confirmation=yellow