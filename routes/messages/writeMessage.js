var mongoose = require('mongoose');
var path = require('path');
var Message = require(path.join(__dirname, '..', '..', 'models', 'message'));
var User = require(path.join(__dirname, '..', '..', 'models', 'user'));
var _ = require('underscore');
var moment = require('moment');

module.exports = function(req, res) {
    // return array of IDs of courses user belongs to
    var courseIds = _.pluck(req.user.courses, '_id');
    var data = {
        user: req.user,
        title: 'Send a Message'
    };

    var getRecipients = function(err, users) {
        if (err) {
            req.flash('error', err);
        }
        // if there are users
        if (users && users.length) {
            data.to = users
        }
        var errors = req.validationErrors();

        if (errors && errors.length) {
            data.error = {};
            // display error only about the first failed validation (others can be dealt with later!)
            var error = errors[0];
            data.error[error.param] = true;
        }

        if (req.body.to) {
            for (var n = 0; n < data.to.length; n++) {
                if (data.to[n]._id.equals(req.body.to)) {
                    data.to[n].selected = true;
                }
            }
        }
        if (req.body.subject) {
            data.subject = req.body.subject;
        }
        if (req.body.origId) {
            Message.findOne({
                    $and: [{
                        _id: mongoose.Types.ObjectId(req.body.origId)
                    }, {
                        $or: [{
                            from: mongoose.Types.ObjectId(req.user._id)
                        }, {
                            to: mongoose.Types.ObjectId(req.user._id)
                        }]
                    }]
                })
                .populate('from')
                .populate('to')
                .exec(function(err, msg) {
                    if (err) {
                        req.flash('error', err);
                    }

                    if (msg) {
                        // if message was found (is a reply or forward)
                        // and if the recipient was passed over
                        // it is a reply message
                        // otherwise, it is a forward
                        if (req.body.to) {
                            data.subject = 'RE: ' + msg.subject;
                            data.title = 'Reply to a Message';
                        } else {
                            data.subject = 'FW: ' + msg.subject;
                            data.title = 'Forward a Message';
                        }
                        data.content += '<p>--</p>';
                        data.content += '<p><strong>From:</strong> ' + msg.to.fullName + '';
                        data.content += '<br><strong>To:</strong> ' + msg.to.fullName + '';
                        data.content += '<br><strong>Subject:</strong> ' + msg.subject + '';
                        data.content += '<br><strong>Date:</strong> ' + moment(msg.date)
                            .format('lll') + '</p>';
                        data.content += '<p>--</p>';
                        data.content += msg.content;
                        process.nextTick(function() {
                            res.render('messages/writeMessage', data);
                        });
                    } else {
                        req.flash('error', 'Sorry, message was not found');
                        process.nextTick(function() {
                            res.render('messages/writeMessage', data);
                        });
                    }
                });
        } else if (req.body.content) {
            data.content = req.body.content;
            process.nextTick(function() {
                res.render('messages/writeMessage', data);
            });
        } else {
            process.nextTick(function() {
                res.render('messages/writeMessage', data);
            });
        }
    };

    if (req.user.role != 'admin') {
        User.find({
            $or: [{
                'courses._id': {
                    $in: courseIds
                }
            }, {
                'role': 'admin'
            }]
        }, getRecipients);
    } else {
        // retrieve all users except self
        User.find({
            _id: {
                $ne: req.user._id
            }
        }, getRecipients);
    }
};