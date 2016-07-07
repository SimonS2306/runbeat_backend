// Load required packages
var mongoose = require('mongoose');
var User = require('../user/userSchema');
//var User = db.model('users', userSchema);
// Define our challenge schema
var Challenge = new mongoose.Schema({
    title: String,
    instruction: String,
    difficulty: String,
    mode: Number, //1: "Challenge requests": User is receiver who can accept/decline challenge
                  //2: "Issued Challenges": User is sender and waits for receiver
                  //3: Challenge accepted by sender and receiver
                  //4: Challenge finished
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