var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Course = require(path.join(__dirname, '..', '..', 'models', 'course'));

var courses = require(path.join(__dirname, 'courses'));
//var viewCourse = require(path.join(__dirname, 'viewCourse'));
var newCourse = require(path.join(__dirname, 'newCourse'));
var saveCourse = require(path.join(__dirname, 'saveCourse'));
var editCourse = require(path.join(__dirname, 'editCourse'));

// professor or facilitator
var isInstructor = function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.user.role == 'professor' || req.user.role == 'facilitator') {
        return next();
    }
    // if the user is not a professor then redirect him to the home page
    req.flash('error', 'You do not have permissions to view this page');
    res.redirect('/courses');
}

var isProfessor = function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.user.role == 'professor') {
        return next();
    }
    // if the user is not a professor then redirect him to the home page
    req.flash('error', 'You do not have permissions to view this page');
    res.redirect('/courses');
}

var getCourseInfo = function (req, res, next) {
    var id = req.params.id || req.body._id;
    console.log('req.body:', req.body);
    console.log("ID:", id);
    Course.findById(mongoose.Types.ObjectId(id))
        .populate('professor facilitators')
        .sort({
            active: 'desc',
            endDate: 'desc'
        })
        .exec(function(err, course) {
            if (!err && course) {
                res.locals.course = course;
                console.log('res.locals.course:', res.locals.course);
            } else {
                req.flash('error', 'Cannot find course');
                return res.redirect('/courses');
            }
            return next();
        });
};

router.use(function(req, res, next) {
    // grab all courseIds
    var courseIds = _.pluck(req.user.courses, '_id');
    if (req.user.role == 'admin') {
        Course.find()
            .populate('professor facilitators')
            .sort({
                active: 'desc',
                endDate: 'desc'
            })
            .exec(function(err, courses) {
                if (!err && courses && courses.length) {
                    res.locals.courses = courses;
                }
                return next();
            });
    } else {
        Course.find({
                _id: {
                    $in: courseIds
                }
            })
            .populate('professor facilitators')
            .sort({
                active: 'desc',
                endDate: 'desc'
            })
            .exec(function(err, courses) {
                if (!err && courses && courses.length) {
                    res.locals.courses = courses;
                }
                return next();
            });
    }
});
router.use('/id/:id', getCourseInfo);
router.get('/', courses);
//router.get('/id/:id', viewCourse);
// new, forward, and reply use the newCourse router and templating
// forward and reply use POST to pass message values
router.get('/new', isProfessor, newCourse);
router.post('/new', isProfessor, newCourse);
router.get('/save', isProfessor, function (req, res) {
    res.redirect('/courses/new');
});
router.post('/save', isProfessor, getCourseInfo, saveCourse);
router.get('/edit', isProfessor, function(req, res) {
    res.redirect('/');
});
router.post('/edit', isProfessor, getCourseInfo, editCourse);
/*router.get('/forward', function(req, res) {
    res.redirect('/inbox');
});
router.post('/forward', editCourse);
router.get('/save', function(req, res) {
    res.redirect('/');
});
router.post('/save', saveCourse);*/

module.exports = router;