/** course.js **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// course schema

var courseSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    professor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, // dropdown
    facilitators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }], // dropdown
    modules: [{
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        }
    }]
});

courseSchema.path('code')
    .validate(function(code) {
        return code.length > 3;
    }, 'Course code must be at least 3 characters');

courseSchema.path('title')
    .validate(function(title) {
        return title.length > 5
    }, 'Course title must be at least 3 characters');

courseSchema.path('description')
    .validate(function(description) {
        return description.length > 10
    }, 'Course description must be at least 10 characters');

module.exports = mongoose.model('Course', courseSchema);