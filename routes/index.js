/*
//The MIT License

Copyright (c) 2010-2018 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

    var express = require('express');
var router = express.Router();
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const Question = require('../models/Question');

const passport = require('../auth/index');


/**
 * GET home page.
 * */
router.get('/', function(req, res, next) {
    console.log(res.locals);
  res.render('root', { sessionFlash: res.locals.sessionFlash});
});

/***
 * LOGIN
 */
router.get('/login', function (req, res, next) {
    res.render('login');
});

//TODO: FIX LOGIN HACK.
// This just redirects the request to either the
//mentor/student auth. The easiest way to fix it is to merge the
//mentor/student tables into 1 table so that you can index by email;
router.post('/login', function (req, res) {
    Student.findOne({email: req.body.email}, function (err, user) {
        if(user){
            res.redirect(307, '/login/student');
            return;
        }
    });
    Mentor.findOne({email: req.body.email}, function (err, user) {
        if(user){
            res.redirect(307, '/login/mentor');
            return;
        }
    });

});
/**
 * Convenience login method for mentors. Check above point for relevant todo
 */
router.post('/login/mentor',
    passport.authenticate('local-mentor', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/mentorboard');
    }
);

/**
 * Convenience login method for students. Check above point for relevant todo and potential fix
 */
router.post('/login/student',
    passport.authenticate('local-student', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/studentboard');
    }
);

/**
 * SIGNUP
 */
router.get('/signup', function (req, res, next) {
  res.render('signup', {});
});

router.post('/signup', function(req, res, next){
    console.log(req.body);
    //check if user taken
    Mentor.findOne({email: req.body.email}, function(err, user){
        console.log(user);
        if(err){
            throw err;
        }
        if(user){
            //set flash message;
            //TODO: figure out why this doesn't work
            req.session.sessionFlash = {
                type: 'error',
                message: 'This email is already in use'
            };
            res.redirect('/');
            return;
        }
        //TODO: Implement validation
        let m = new Mentor({
            email: req.body.email,
            password: req.body.password,
            name: 'null'

        });
        //go to onboarding-flow
        m.save(function(err){
            if(err){
                throw err;
            }
            //TODO: Insecure
            res.redirect('/onboard?email='+req.body.email);
        });
    });

});

router.get('/onboard', function (req, res, next) {
    res.render('onboard-1', {email: req.query.email});
});

router.get('/onboard-2', function (req, res, next) {
    //TODO: Make this more robust...
    let interests = JSON.parse(JSON.stringify(req.query));
    delete interests.email;
    res.render('onboard-2', {email: req.query.email, interests: Object.keys(interests)});
});

router.post('/register', function (req, res, next) {
    console.log(req.body);
    //TODO: validate data

    Mentor.findOneAndUpdate(
        {email: req.body.email},
        {$set: {
            name: req.body.firstName+' '+req.body.lastName,
            position: req.body.position,
            location: req.body.country,
            bio: req.body.bio,
            experience: req.body.skills,
            interests: req.body.interests.split(',')
        }}, null, function(err){
            if(err) {
                throw err;
            }
            req.session.sessionFlash = {
                type: 'success',
                message: 'Please login to get to the dashboard'
            };
            res.redirect('/');
        });
});

router.get('/mentorboard', checkAuth, function(req, res, next){
    let mentor = Mentor.findOne({email: req.user.email}).populate('students').exec(function (err, user) {
        console.log(user);
        let params = {};
        params.students = user.students.map(function (student) {
            return {
                name: student.name,
                interests: student.interests.join(', '),
                avatar: student.avatar || 'https://www.accountingweb.com/sites/all/modules/custom/sm_pp_user_profile/img/default-user.png'
            };
        });
        Student.find({requestedMentor: true}, function (err, requestees) {
            console.log(requestees);
            let reqs = requestees.map((student) => {
                return {
                    name: student.name,
                    interests: student.interests.join(', '),
                    avatar: student.avatar || 'https://www.accountingweb.com/sites/all/modules/custom/sm_pp_user_profile/img/default-user.png'
                };
            });
            res.render('mentorboard', {students: params.students, requestedMentor: reqs});
        });

    });



});

/***
 * FORUM
 */
router.get('/questionboard', checkAuth, function(req, res, next){
    Question.find({}).sort('-postedAt').limit(3).populate('poster').exec(function(err, qs){
        let params = {};
        //Clean up object passed into HBS
        params.questions = qs.map((q) => {
            return {
                question: q.question,
                description: q.description,
                author: q.poster.name,
                avatar: q.poster.avatar || 'https://www.accountingweb.com/sites/all/modules/custom/sm_pp_user_profile/img/default-user.png',
                postedAt: q.postedAt
            };
        });

        res.render('questionboard', {questions: params.questions});

    });

});

router.get('/studentboard', checkAuth, function (req, res, next) {
    let s = Student.findOne({email: req.user.email}).populate('mentors').exec(function (err, user) {
        let params = {};
        params.mentors = user.mentors.map(function (mentor) {
            return {
                name: mentor.name,
                interests: mentor.interests.join(', '),
                avatar: mentor.avatar || 'https://www.accountingweb.com/sites/all/modules/custom/sm_pp_user_profile/img/default-user.png'
            };
        });
        Mentor.find({'name': {$ne: 'null'}}, function (err, mentors) {
            let ms = mentors.map((mentor) => {
                return {
                    name: mentor.name,
                    interests: mentor.interests.join(', '),
                    avatar: mentor.avatar || 'https://www.accountingweb.com/sites/all/modules/custom/sm_pp_user_profile/img/default-user.png'
                };
            });
            res.render('studentboard', {mentors: params.mentors, availMentors: ms});
        });

    });
});

/**
 * Logout method
 */
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