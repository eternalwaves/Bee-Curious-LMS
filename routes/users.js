var User = require('../models/user');

module.exports = function(req, res) {
    var messageType = req.params.type;
    User.find({}, function(err, users) {
        if (err) {
            req.flash('error', err);
        }
        var data = {
            title: 'Users',
            users: users
        };
        res.render('users/users', data);
    });
};