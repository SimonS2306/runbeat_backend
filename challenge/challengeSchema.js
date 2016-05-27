// Load required packages
var mongoose = require('mongoose');

// Define our challenge schema
var Challenge = new mongoose.Schema({

    title: String,
    instruction: String,
    difficulty: String,
    accepted: Boolean,
    finished: Boolean,
    participants : {
        sender : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'}}});

// Export the Mongoose model
module.exports = mongoose.model('Challenge', Challenge);