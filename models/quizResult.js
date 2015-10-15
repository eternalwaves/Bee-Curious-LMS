/** quizResult.js **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var answerSchema = require('./answer');

// quiz schema

var quizSchema = new Schema({
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
    questions: [Question.schema],
    percentage: {
        type: Number,
        required: true
    }
});

quizSchema.path('course')
    .validate(function(course) {
        return course.length > 3;
    }, 'Must specify course id');

quizSchema.path('title')
    .validate(function(title) {
        return title.length > 0
    }, 'Quiz title cannot be blank');

quizSchema.path('description')
    .validate(function(description) {
        return description.length > 0
    }, 'Quiz description cannot be blank');

module.exports = mongoose.model('Quiz', quizSchema);