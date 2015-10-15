/** message.js **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, // auto assigned
    to: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, //dropdown
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
});

messageSchema.path('subject')
    .validate(function(subject) {
        return subject.length > 0;
    }, 'Subject cannot be empty');

messageSchema.path('content')
    .validate(function(content) {
        return content.length > 5
    }, 'Message content must have at least 5 characters');

module.exports = mongoose.model('Message', messageSchema);