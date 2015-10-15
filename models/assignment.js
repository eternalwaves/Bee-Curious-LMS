/** assignment.js **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// assignment schema

var assignmentSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    }, // auto assigned
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    filePath: {
        type: String
    },
    content: {
        type: String
    },
    dueDate: {
        type: Date,
        required: true
    }
});

assignmentSchema.path('course')
    .validate(function(course) {
        return course.length > 3;
    }, 'Must specify course id');

assignmentSchema.path('title')
    .validate(function(title) {
        return title.length > 0
    }, 'Assignment title cannot be blank');

assignmentSchema.path('description')
    .validate(function(description) {
        return description.length > 0
    }, 'Assignment description cannot be blank');

module.exports = mongoose.model('Assignment', assignmentSchema);