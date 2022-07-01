const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')

passport.use(
    new GoogleStrategy(
        {
            clientID: '54874248683-ip2eehq7apctnipcd7selfuv62r3ltd1.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: '/api/auth/google/callback',
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile)
            cb(null, profile)
        }
    )
)

passport.serializeUser((user, cb) => {
    cb(null, user)
})

passport.deserializeUser((user, cb) => {
    cb(null, user)
})
