var passport = require('passport');
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var crypto = require('crypto');
var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var hbs = require('hbs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('express-flash');

mongoose.connect('mongodb://127.0.0.1:27017/beecurious');

var app = express();

// Middleware
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));
var helpers = require(path.join(__dirname, 'helpers/index'));
helpers(hbs);

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());
app.use(cookieParser());
//session management
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'PH34R t3h b33s!'
}));
// use passport to manage sessions
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
var initPassport = require(path.join(__dirname, 'passport/init'));
initPassport(passport);

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

// Routes
var routes = require(path.join(__dirname, 'routes', 'index'))(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;