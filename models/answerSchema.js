/** answerSchema.js **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }, // short, multi
    points: {
        type: Number,
        required: true
    }
});

answerSchema.path('type')
    .validate(function(type) {
        return /short|multi/i.test(type);
    }, 'Invalid answer type');

module.exports = answerSchema;