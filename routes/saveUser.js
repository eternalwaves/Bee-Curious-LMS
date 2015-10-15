/* This is used by admins only, who only have permission to update users' email and role, not personal data */

var mongoose = require('mongoose');
var User = require('../models/user');
var _ = require('underscore');
var editUser = require('./editUser');

module.exports = function(req, res, next) {
    findOrUpdateUser = function() {
        // find a user in Mongo with provided username
        User.findById(mongoose.Types.ObjectId(req.body.id), function(err, user) {
            // In case of any error, redirect to users page
            if (err) {
                req.flash('error', err);
                return res.redirect('/users');
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
                    'role': {
                        notEmpty: true,
                        errorMessage: 'You must select a role'
                    }
                };

                req.checkBody(checkData);

                var errors = req.validationErrors();

                if (errors && errors.length) {
                    req.flash('error', errors[0].msg); // show first error message only
                    return res.redirect('/users');
                }

                // set the user's local credentials
                _.each(req.body, function(value, key, obj) {
                    user[key] = value;
                });

                // save the user
                user.save(function(err) {
                    if (err) {
                        req.flash('error', 'Sorry, there was an error saving the user');
                        return editUser(req, res);
                    } else {
                        req.flash('success', 'User successfully updated')
                        return res.redirect('/users');
                    }
                });
            } else {
                req.flash('error', 'Cannot find user');
                return res.redirect('/users');
            }
        });
    };
    // Delay the execution of findOrUpdateUser and execute the method
    // in the next tick of the event loop
    process.nextTick(findOrUpdateUser);
}