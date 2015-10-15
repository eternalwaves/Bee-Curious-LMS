var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function() {
                // find a user in Mongo with provided username
                User.findOne({
                    username: username
                }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('error', 'User already exists'));
                    } else {
                        var checkData = {
                            'username': {
                                notEmpty: true,
                                isLength: {
                                    options: [2],
                                    errorMessage: 'Username must be at least 2 characters long' // Error message for the validator, takes precedent over parameter message
                                },
                                errorMessage: 'Invalid username' // Error message for the parameter
                            },
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

                        req.checkBody(checkData);
                        
                        var errors  = req.validationErrors();

                        if (errors  && errors.length) {
                            return done(null, false, req.flash('error', errors[0].msg)); // show first error message only
                        }

                        confirm = req.body.confirm;

                        var validPass = validatePassword(password, confirm);
                        if (!validPass) {
                            return done(null, false, req.flash('error', 'Password and confirmation must match'));
                        }

                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = password;
                        newUser.email = req.body.email;
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;

                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            return done(null, newUser, req.flash('success', 'User registration successful'));
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);

            validatePassword = function(password, confirm) {
                return (password == confirm);
            };
        })
    );
}