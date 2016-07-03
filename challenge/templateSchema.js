
// Load required packages
var mongoose = require('mongoose');

// Define our template schema
var Template = new mongoose.Schema({
    title: String,
    instruction: String,
    difficulty: String,
    });

// Export the Mongoose model
module.exports = mongoose.model('Template', Template);
