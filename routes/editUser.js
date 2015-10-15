var mongoose = require('mongoose');
module.exports = function (req, res) {
    var id = req.body.id;
    var data = {
        title: 'Edit User'
    };
    var User = require('../models/user');
    User.findById(mongoose.Types.ObjectId(id), function(err, user) {
        if (err) {
            req.flash('error', err);
            console.log(err);
            return res.redirect('/users');
        }
        if (user) {
            data.userToEdit = user;
        } else {
            req.flash('error', 'Cannot find user');
            return res.redirect('/users');
        }
        res.render('users/editUser', data);
    });
};