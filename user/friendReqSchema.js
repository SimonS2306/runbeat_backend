/**
 * Created by panfei on 16/7/3.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var friendReqSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    },

    receiver: {
        type: String,
        required: true
    },

    status : { // 0: sent 1: accepted 2: declined
        type : Number,
        required: true

    }

});


module.exports = mongoose.model('FriendReq', friendReqSchema);