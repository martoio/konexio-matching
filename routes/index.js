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

//TODO: FIX LOGIN HACK. This just redirects the request to either the
//mentor/student auth. The easiest way to fix it is to merge the
//mentor/student tables into 1 table so that you can index by email;
router.post('/login', function (req, res) {
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

router.post('/login/mentor',
    passport.authenticate('local-mentor', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/mentorboard');
    }
);


router.post('/login/student',
    passport.authenticate('local-student', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);

function log(req, res, next){
    next();
}

router.get('/signup', function (req, res, next) {
  res.render('signup', {});
});

router.post('/signup', function(req, res, next){

});

router.get('/mentorboard', checkAuth, function(req, res, next){
    let mentor = Mentor.findOne({email: req.user.email}).populate('students').exec(function (err, user) {
        console.log(user);
        let params = {};
        params.students = user.students.map(function (student) {
            return {
                name: student.name,
                interests: student.interests.join(', '),
                avatar: student.avatar
            };
        });
        Student.find({requestedMentor: true}, function (err, requestees) {
            console.log(requestees);
            let reqs = requestees.map((student) => {
                return {
                    name: student.name,
                    interests: student.interests.join(', '),
                    avatar: student.avatar
                };
            });
            res.render('mentorboard', {students: params.students, requestedMentor: reqs});
        });

    });



});

router.get('/questionboard', checkAuth, function(req, res, next){
    res.render('questionboard');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;


function checkAuth(req, res, next) {
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect('/');
    }
}