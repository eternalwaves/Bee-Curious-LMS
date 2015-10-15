var path = require('path');
var mongoose = require('mongoose');
var Message = require(path.join(__dirname, '..', '..', 'models', 'message'));
var User = require(path.join(__dirname, '..', '..', 'models', 'user'));

module.exports = function(req, res) {
    var messageType = req.params.type;
    var showMessages = function(err, msgs) {
        if (err) {
            req.flash('error', err);
        }
        var data = {
            title: messageType.charAt(0)
                .toUpperCase() + messageType.slice(1)
        };
        if (msgs && msgs.length) {
            data.msgs = msgs;
            switch (messageType) {
                case 'inbox':
                    data.inbox = true;
                    break;
                case 'sent':
                    data.sent = true;
                    break;
            }
            res.render('messages/messages', data);
        } else {
            res.render('messages/messages', data);
        }
    };

    switch (messageType) {
        case 'inbox':
            // where the user is the recipient
            Message.find({
                    to: mongoose.Types.ObjectId(req.user._id)
                })
                .sort({
                    date: 'desc'
                })
                .populate('from')
                .populate('to')
                .exec(showMessages);
            break;
        case 'sent':
            // where the user is the sender
            Message.find({
                    from: mongoose.Types.ObjectId(req.user._id)
                })
                .sort({
                    date: 'desc'
                })
                .populate('from')
                .populate('to')
                .exec(showMessages);
            break;
    }
};