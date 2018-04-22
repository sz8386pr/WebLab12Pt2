var express = require('express');
var passport = require('passport');

var router = express.Router();

// GET main page
router.get('/', function(req, res, next){
    res.render('authentication');
});

// POST login page
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
}));

// POST signup page.
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
}));

// GET logout. Logout and redirect to main page
router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/')
});

module.exports = router;