// Load required packages
var mongoose = require('mongoose');

// Define our challenge schema
var Challenge = new mongoose.Schema({
    title: String,
    type: Number, // 1 = circle, 2 = triangle
    instruction: String,
    difficulty: String,
    status: Number,
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