const passport = require('passport');
let strategies = {
    //TODO:

    //If needed, you can integrate third-party login providers
    // 'facebook-strategy': require('./facebook/'),
    // 'google-strategy': require('./google/'),
    'local-mentor': require('./local/mentorAuth'),
    'local-student': require('./local/studentAuth')
};

/*
* Serialize/Deserialize User implementations
* */
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

for(let strategy in strategies) {
    passport.use(strategy, strategies[strategy]);
}


module.exports = passport;