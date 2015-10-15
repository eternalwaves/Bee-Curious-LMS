var express = require('express');
var router = express.Router();
var path = require('path');

var messages = require(path.join(__dirname, 'messages'));
var readMessage = require(path.join(__dirname, 'readMessage'));
var writeMessage = require(path.join(__dirname, 'writeMessage'));
var sendMessage = require(path.join(__dirname, 'sendMessage'));

router.get('/', function (req, res) {
    res.redirect('/messages/inbox');
});
router.get('/:type(inbox|sent)', messages);
router.get('/read/:id', readMessage);
// new, forward, and reply use the writeMessage router and templating
// forward and reply use POST to pass message values
router.get('/new', writeMessage);
router.get('/reply', function (req, res) {
    res.redirect('/messages/inbox');
});
router.post('/reply', writeMessage);
router.get('/forward', function (req, res) {
    res.redirect('/messages/inbox');
});
router.post('/forward', writeMessage);
router.get('/send', function (req, res) {
    res.redirect('/messages/new');
});
router.post('/send', sendMessage);

module.exports = router;