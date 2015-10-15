/** user.js **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// User schema

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
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
    role: {
        type: String,
        required: true,
        default: 'student'
    }, //admin, professor, facilitator, student
    courses: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            unique: true
        },
        group: Number // only used for assigning facilitators
    }],
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// virtual for getting fullName (display purposes)
userSchema.virtual('fullName')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });

userSchema.path('username')
    .validate(function(username) {
        return username.length > 0;
    }, 'Username cannot be blank');

userSchema.path('email')
    .validate(function(email) {
        return email.length > 0
    }, 'Email cannot be blank');

userSchema.path('role')
    .validate(function(role) {
        return /admin|professor|facilitator|student/i.test(role);
    }, 'Invalid role');

// hash passwords upon save
userSchema.pre('save', function(next) {
    // do something before you save...
    var user = this;
    var SALT_FACTOR = 10;

    // do not need to rehash if unchanged
    if (!user.isModified('password')) {
        return next();
    }

    // generate new salt
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        // rehash password
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

userSchema.methods.uploadPhotos = function(file, callback) {
    // upload photos
    callback(file);
};

module.exports = mongoose.model('User', userSchema);