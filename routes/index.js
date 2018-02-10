var express = require('express');
var router = express.Router();
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');

const passport = require('../auth/index');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('root', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login/mentor',
    passport.authenticate('local-mentor', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);
//TODO: FIX LOGIN HACK. This just redirects the request to either the
//mentor/student auth. The easiest way to fix it is to merge the
//mentor/student tables into 1 table so that you can index by email;
router.post('/login', function (req, res) {
    console.log(req.body);
    Student.findOne({email: req.body.email}, function (err, user) {
        if(user){
            res.redirect(307, '/login/student');
        }
    });
    Mentor.findOne({email: req.body.email}, function (err, user) {
        if(user){
            res.redirect(307, '/login/mentor');
        }
    });

});

router.post('/login/student',
    passport.authenticate('local-student', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);

function log(req, res, next){
    console.log(req.body);
    next();
}

router.get('/signup', function (req, res, next) {
  res.render('signup', {});
});

router.post('/signup', function(req, res, next){

});

router.get('/mentorboard', function(req, res, next){
    res.render('mentorboard');
});

router.get('/questionboard', function(req, res, next){
    res.render('questionboard');
});

module.exports = router;
