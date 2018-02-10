const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//TODO: This is a scaffold for implementing a third-party strategy.
// Expand and use as needed.

let gStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    // profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    //TODO: Do something meaningful
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    done(null, profile);
});

module.exports = gStrategy;