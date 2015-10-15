var path = require('path');
var mongoose = require('mongoose');

module.exports = function(req, res) {
    var showCourses = function() {
        var data = {
            title: 'Courses'
        };
        if (res.locals.courses) {
            data.courses = res.locals.courses;
        }
        res.render('courses/courses', data);
    };

    showCourses();
};