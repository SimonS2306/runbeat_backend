
// Load required packages
var mongoose = require('mongoose');

// Define our template schema
var Template = new mongoose.Schema({
    title: String,
    type: Number, // 1 = circle, 2 = triangle
    instruction: String,
    difficulty: String,
    status: Number
    });

// Export the Mongoose model
module.exports = mongoose.model('Template', Template);
