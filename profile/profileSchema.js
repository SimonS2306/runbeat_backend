var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var profileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    firstName: {
        type: String,
        required: true
    },
    
    lastName: {
        type: String,
        required: true
    },

    birthday: {
        type : Date,
        required: true
    },

    profileImagePath: {
        type : String,
        required: true
    },
    credo: {
        type : String,
        required: true
    }

});



profileSchema.methods.uploadProfileImage = function(image) {
    var path = "";

    return path;
};


var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;