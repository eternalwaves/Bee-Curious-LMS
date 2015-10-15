var LocalStrategy = require('passport-local')
    .Strategy;
var User = require('../models/user');
var _ = require('underscore');

module.exports = function(passport) {

    passport.use('update', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrUpdateUser = function() {
                // find a user in Mongo with provided username
                User.findOne({
                    username: username
                }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('Error updating: ' + err);
                        return done(err);
                    }
                    // user found
                    if (user) {
                        var checkData = {
                            'email': {
                                notEmpty: true,
                                isEmail: {
                                    errorMessage: 'Invalid email'
                                }
                            },
                            'password': {
                                notEmpty: true,
                                isLength: {
                                    options: [2] // pass options to the validator with the options property as an array
                                },
                                errorMessage: 'Invalid password' // Error message for the parameter
                            },
                            'confirm': {
                                notEmpty: true,
                                errorMessage: 'Password confirmation cannot be empty' // Error message for the parameter
                            },
                            'firstName': {
                                notEmpty: true,
                                isLength: {
                                    options: [2],
                                    errorMessage: 'First name must be at least 2 characters long' // Error message for the validator, takes precedent over parameter message
                                },
                                errorMessage: 'First name cannot be empty'
                            },
                            'lastName': {
                                notEmpty: true,
                                isLength: {
                                    options: [2],
                                    errorMessage: 'Last name must be at least 2 characters long' // Error message for the validator, takes precedent over parameter message
                                },
                                errorMessage: 'Last name cannot be empty'
                            }
                        };

                        // validate if set
                        if (req.body.role) {
                            checkData.role = {
                                notEmpty: true,
                                errorMessage: 'You must select a role'
                            }
                        }

                        req.checkBody(checkData);

                        var errors = req.validationErrors();

                        if (errors && errors.length) {
                            return done(null, false, req.flash('error', errors[0].msg)); // show first error message only
                        }

                        if (
                            (user.password != password) ||
                            (user.email != req.body.email)
                        ) {
                            var confirm = req.body.confirm;
                            var validPass = validatePassword(password, confirm);
                            if (!validPass) {
                                return done(null, false, req.flash('error', 'Password and confirmation must match'));
                            }
                            user.password = password;
                        }

                        // set the user's local credentials
                        _.each(req.body, function (value, key, obj) {
                            user[key] = value;
                        });

                        // save the user
                        user.save(function(err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User successfully updated.');
                            return done(null, user, req.flash('success', 'User successfully updated'));
                        });
                    } else {
                        console.log('Cannot find user:  ' + username);
                        return done(null, false, req.flash('error', 'Cannot find user'));
                    }
                });
            };
            // Delay the execution of findOrUpdateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrUpdateUser);

            validatePassword = function(password, confirm) {
                return (password == confirm);
            };
        }));
}