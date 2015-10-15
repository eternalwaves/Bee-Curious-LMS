var path = require('path');
var mongoose = require('mongoose');
var Course = require(path.join(__dirname, '..', '..', 'models', 'course'));
var User = require(path.join(__dirname, '..', '..', 'models', 'user'));
var _ = require('underscore');
var newCourse = require(path.join(__dirname, 'newCourse'));

module.exports = function(req, res) {
    var data = {
        title: 'Edit Course'
    };

    var editForm = function (err, users) {
        if (err) {
            req.flash('error', err);
        }
        if (users && users.length) {
            // all facilitators
            data.facilitators = users;
            // course facilitators
            courseFacilitators = res.locals.course.facilitators;

            // if course exists and has facilitators
            if (res.locals.course && courseFacilitators && courseFacilitators.length) {
                // compare all facilitators to course facilitators
                // add "selected" property to course facilitators in all facilitators array
                for (var x = 0; x < data.facilitators.length; x++) {
                    for (var y = 0; y < courseFacilitators.length; y++) {
                        if (data.facilitators[x]._id.equals(courseFacilitators[y]._id)) {
                            data.facilitators[x].selected = true;
                            break; // break out of current loop, continue through other facilitators
                        }
                    }
                }
            }

            res.render('courses/newCourse', data);
        }
    };

    // retrieve all facilitators
    User.find({
        role: 'facilitator'
    }, editForm);
};