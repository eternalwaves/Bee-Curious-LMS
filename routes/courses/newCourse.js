var mongoose = require('mongoose');
var path = require('path');
var User = require(path.join(__dirname, '..', '..', 'models', 'user'));
var _ = require('underscore');

module.exports = function(req, res) {
    // return array of IDs of courses user belongs to
    var data = {
        title: 'Create a Course'
    };

    var showForm = function(err, users) {
        if (err) {
            req.flash('error', err);
        }
        // if there are users
        if (users && users.length) {
            data.facilitators = users;
        }

        res.render('courses/newCourse', data);
    };

    // retrieve all facilitators
    User.find({
        role: 'facilitator'
    }, showForm);
};