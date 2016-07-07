// Load required packages
var mongoose = require('mongoose');
var User = require('../user/userSchema');
//var User = db.model('users', userSchema);
// Define our challenge schema
var Challenge = new mongoose.Schema({
    title: String,
    index: Number,
    //instruction: String,
    //difficulty: String,
    mode: Number, //1: "Challenge pending"
                  //2: "Ongoing Challenge"
                  //3: "Finished Challenge"
    sender : String,
    receiver: String
});

// Export the Mongoose model
module.exports = mongoose.model('Challenge', Challenge);

/*
 sender : {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User'
 },
 receiver: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User'}
 */