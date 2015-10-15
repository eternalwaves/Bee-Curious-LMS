var path = require('path');
var mongoose = require('mongoose');
var Course = require(path.join(__dirname, '..', '..', 'models', 'course'));
var User = require(path.join(__dirname, '..', '..', 'models', 'user'));
var _ = require('underscore');
var newCourse = require(path.join(__dirname, 'newCourse'));

module.exports = function(req, res) {
    var createOrUpdateCourse = function () {
        var checkData = {
            'code': {
                notEmpty: true,
                isLength: {
                    options: [3],
                    errorMessage: 'Course code must be at least 3 characters' // Error message for the validator, takes precedent over parameter message
                },
                errorMessage: 'Course code cannot be blank' // Error message for the parameter
            },
            'title': {
                notEmpty: true,
                isLength: {
                    options: [5],
                    errorMessage: 'Course title must be at least 3 characters'
                },
                errorMessage: 'Course title cannot be blank' // Error message for the parameter
            },
            'description': {
                notEmpty: true,
                isLength: {
                    options: [10],
                    errorMessage: 'Course description must be at least 10 characters'
                },
                errorMessage: 'Course description cannot be blank' // Error message for the parameter
            },
            'endDate': {
                notEmpty: true,
                errorMessage: 'Please select an end date'
            }
        };

        req.checkBody(checkData);

        var errors = req.validationErrors();

        // course exists - update
        if (res.locals.course) {
            console.log('Course exists!', res.locals.course._id);
            var course = res.locals.course;
            console.log('course id:', course._id);
            if (errors && errors.length) {
                req.flash('error', errors[0].msg); // show first error message only
                return editCourse(req, res);
            } else {
                // set the messages's local credentials
                _.each(req.body, function(value, key, obj) {
                    if (key == '_id') {
                        course[key] = mongoose.Types.ObjectId(value);
                    } else {
                        course[key] = value;
                    }
                });

                course.professor = req.user._id;

                // save the messages
                course.save(function(err, obj) {
                    if (err) {
                        req.flash('error', err);
                        return editCourse(req, res);
                    } else {
                        req.flash('success', 'Course successfully saved');
                        // put into array if not already
                        var facilitators = [].concat(req.body.facilitators);
                        console.log('Facilitators:', facilitators);
                        var instructors = _.union(facilitators, [req.user._id]);
                        console.log('Instructors:', instructors);

                        // now update the User profiles

                        // first, add Course to users who did not previous have them!
                        User.update({
                            _id: {
                                $in: instructors
                            }
                        }, {
                            $addToSet: {
                                courses: {_id: mongoose.Types.ObjectId(obj._id)}
                            }
                        }, {
                            multi: true
                        }, function(err, users) {
                            if (err) {
                                console.log('Error:', err);
                            }
                            console.log('Users added:', users);
                        });

                        // then, remove Course from users who were previously assigned but were removed =()
                        User.update({
                            _id: {
                                $nin: instructors
                            }
                        }, {
                            $pull: {
                                courses: {_id: mongoose.Types.ObjectId(obj._id)}
                            }
                        }, {
                            multi: true
                        }, function(err, users) {
                            if (err) {
                                console.log('Error:', err);
                            }
                            console.log('Users removed:', users);
                        });
                        return res.redirect('/course/id/' + obj._id);
                    }
                });
            }
        } else { // new course
            // create the message
            var course = new Course();

            // set the messages's local credentials
            _.each(req.body, function(value, key, obj) {
                course[key] = value;
            });

            course.professor = req.user._id;

            // save the messages
            course.save(function(err, obj) {
                if (err) {
                    req.flash('error', err);
                    return newCourse(req, res);
                } else {
                    // put into array if not already
                    var facilitators = [].concat(req.body.facilitators);
                    facilitators.forEach(function (index, facilitator, facilitators) {
                        facilitators[index] = mongoose.Types.ObjectId(facilitator);
                    })
                    console.log('Facilitators:', facilitators);
                    var instructors = _.union(facilitators, [req.user._id]);
                    console.log('Instructors:', instructors);

                    // now update the User profiles
                    User.update({
                        _id: {
                            $in: instructors
                        }
                    }, {
                        $addToSet: {
                            courses: {_id: mongoose.Types.ObjectId(obj._id)}
                        }
                    }, {
                        multi: true
                    }, function(err, users) {
                        if (err) {
                            console.log('Error:', err);
                        }
                        console.log('Users added:', users);
                    });
                    return res.redirect('/course/id/' + obj._id);
                }
            });
        }
    };
    // Delay the execution of findOrCreateUser and execute the method
    // in the next tick of the event loop
    process.nextTick(createOrUpdateCourse);

};