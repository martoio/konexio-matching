const LocalStrategy = require('passport-local').Strategy;
const Student = require('../../models/Student');
const localStrategy = new LocalStrategy({
        usernameField: 'email',
    },
    function (email, password, done) {
        //Try to find user from username;
        Student.findOne({email}, function(err, user){
            if(err){
                return done(err);
            }
            //User doesn't exist in DB
            if(!user){
                return done(null, false);
            }
            //passwords don't match
            if(!user.isValidPassword(password)){
                return done(null, false);
            }

            return done(null, user);
        });
    });


module.exports = localStrategy;