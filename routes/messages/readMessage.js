var path = require('path');
var mongoose = require('mongoose');
var Message = require(path.join(__dirname, '..', '..', 'models', 'message'));

module.exports = function(req, res) {
    var showMessage = function(err, msg) {
        if (err) {
            req.flash('error', err);
        }
        var data = {
            title: 'Message'
        };
        if (msg) {
            // only display if user matches the sender or recipient
            if (
                msg.to._id.equals(req.user._id) ||
                msg.from._id.equals(req.user._id)
            ) {
                data.msg = msg;
                if (msg.to._id.equals(req.user._id)) {
                    msg.read = true;
                    msg.save();
                }
                res.render('messages/readMessage', data);
            } else {
                req.flash('error', 'You do not have permission to view this message!');
                res.redirect('/messages/inbox');
            }
        } else {
            req.flash('error', 'Sorry, message was not found');
            res.render('messages/readMessage', data);
        }
    };

    // find message by id
    Message.findById(mongoose.Types.ObjectId(req.params.id))
        .populate('from')
        .populate('to')
        .exec(showMessage);
};