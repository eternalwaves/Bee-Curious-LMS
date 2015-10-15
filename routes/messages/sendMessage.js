var path = require('path');
var Message = require(path.join(__dirname, '..', '..', 'models', 'message'));
var _ = require('underscore');
var writeMessage = require(path.join(__dirname, 'writeMessage'));

module.exports = function(req, res) {
    var createMessage = function () {
        var checkData = {
            'to': {
                notEmpty: true,
                errorMessage: 'Select a recipient' // Error message for the parameter
            },
            'subject': {
                notEmpty: true,
                errorMessage: 'Subject cannot be empty' // Error message for the parameter
            },
            'content': {
                notEmpty: true,
                isLength: {
                    options: [5],
                    errorMessage: 'Message body must have at least 5 characters' // Error message for the validator, takes precedent over parameter message
                },
                errorMessage: 'Message cannot be empty'
            }
        };

        req.checkBody(checkData);
        
        var errors  = req.validationErrors();

        if (errors  && errors.length) {
            req.flash('error', errors[0].msg); // show first error message only
            return writeMessage(req, res);
        } else {

            // create the message
            var newMessage = new Message();

            // set the messages's local credentials
            newMessage.from = req.user._id; // set from to current user
            newMessage.to = req.body.to;
            newMessage.subject = req.body.subject;
            newMessage.content = req.body.content;

            // save the messages
            newMessage.save(function(err) {
                if (err) {
                    req.flash('error', err);
                    return writeMessage(req, res);
                } else {
                    req.flash('success', 'Message successfully sent');
                    return res.redirect('/messages/inbox');
                }
            });
        }
    };
    // Delay the execution of findOrCreateUser and execute the method
    // in the next tick of the event loop
    process.nextTick(createMessage);

};