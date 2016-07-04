var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    dateOfBirth :{
      type : Date,
        required: false,
        unique: false
    },
    credo: {
        type: String,
        required: false,
        unique: false
    },
    forename: {
        type: String,
        required: false,
        unique: false
    },
    surname: {
        type: String,
        required: false,
        unique: false
    },
    friends: {
        type: [String],
        required:false,
        unique: false
    },
    profileImagePath:{
        type: String,
        required : false
    }

});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports.uploadProfileImage = function(req, res){

    var name = req.params.name;
    console.log(req.body);
    console.log(req.file);

    var type = req.file.mimetype;
    Profile.findOne({name: name}, function(err, profile){
        if (err){
            res.status(500).send("Server is not available");
            return;
        }
        if (!profile) {
            res.status(401).send('No such user!'+name);
            return;
        }
        profile.profileImagePath = req.file.name;
        res.status(200).json("upload profile image successful");
    });

    ;
}

module.exports.downloadProfileImage = function(req, res){
    var pic_id = req.params.id;
    var path = "./uploads/" + pic_id;

    var mine = "image/jpeg";

    res.setHeader('Content-disposition', 'attachment; filename=' + pic_id);
    res.setHeader('Content-type', mine);

    var fileStream = fs.createReadStream(path);
    fileStream.pipe(res);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
