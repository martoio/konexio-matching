var express = require('express');
var router = express.Router();
const passport = require('../auth/index');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('root', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login/mentor',
    log,
    passport.authenticate('local-mentor', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/dashboard');
    }
);

router.post('/login/student',
    log,
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

module.exports = router;
