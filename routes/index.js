var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');

var home = require(path.join(__dirname, 'home'));
var signup = require(path.join(__dirname, 'signup'));
var login = require(path.join(__dirname, 'login'));

// visible only to those logged in
var profile = require(path.join(__dirname, 'profile'));
var messageRouter = require(path.join(__dirname, 'messages', 'index'));
var courseRouter = require(path.join(__dirname, 'courses', 'index'));

//var courses = require(path.join(__dirname, 'courses'));
//var quizzes = require(path.join(__dirname, 'quizzes'));

// visible only to admins, professors, and facilitators
/*var addCourse = require(path.join(__dirname, 'addCourse'));
var viewCourse = require(path.join(__dirname, 'viewCourse'));
var editCourse = require(path.join(__dirname, 'editCourse'));
var saveCourse = require(path.join(__dirname, 'saveCourse'));

// visible only to professors and facilitators
var addQuiz = require(path.join(__dirname, 'addQuiz'));
var editQuiz = require(path.join(__dirname, 'editQuiz'));
var editCourse = require(path.join(__dirname, 'editCourse'));
var saveCourse = require(path.join(__dirname, 'saveCourse'));*/

// visible only to admins
var users = require(path.join(__dirname, 'users'));
var editUser = require(path.join(__dirname, 'editUser'));
var saveUser = require(path.join(__dirname, 'saveUser'));

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated()) {
        return next();
    }
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/login');
}

var isAdmin = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.user.role == 'admin') {
        return next();
    }
    // if the user is not authenticated then redirect him to the home page
    req.flash('error', 'You do not have permissions to view this page');
    res.redirect('/courses');
}

var isFacilitator = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.user.role == 'facilitator') {
        return next();
    }
    // if the user is not authenticated then redirect him to the home page
    req.flash('error', 'You do not have permissions to view this page');
    res.redirect('/courses');
}

module.exports = function (passport) {
    /* GET home page. */
    router.get('/', home);

    router.get('/login', login);
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash : true  
    }));

    router.get('/signup', signup);
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash : true  
    }));

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // authenticated-only paths
    router.get('/profile', isAuthenticated, profile);
    router.post('/profile', isAuthenticated, passport.authenticate('update', {
        successRedirect: '/profile',
        failureRedirect: '/profile',
        failureFlash : true
    }));

    router.use('/messages', isAuthenticated, messageRouter);
    router.use('/courses', isAuthenticated, courseRouter);

    // admin-only paths
    router.get('/users', isAuthenticated, isAdmin, users);
    router.get('/users/edit', isAuthenticated, isAdmin, function (req, res) {
        res.redirect('/users');
    });
    router.post('/users/edit', isAuthenticated, isAdmin, editUser);
    router.get('/users/save', isAuthenticated, isAdmin, function (req, res) {
        res.redirect('/users');
    });
    router.post('/users/save', isAuthenticated, isAdmin, saveUser);

    return router;
};