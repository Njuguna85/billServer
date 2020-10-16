const bcrypt = require('bcrypt');
const User = require('../models/User');
const localStrategy = require('passport-local').Strategy
const GoogleStatergy = require('passport-google-oauth20').Strategy;

function initialize(passport) {
    // first we tell passport what strategy we 
    //would like to use
    passport.use(new GoogleStatergy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: 'https://gis.predictiveanalytics.co.ke/auth/google/callback'
            },
            // access the user details from the profile
            async(accessToken, refreshToken, profile, done) => {
                const newUser = {
                        google_id: profile.id,
                        full_name: profile.displayName,
                        image: profile.photos[0].value,
                        email: profile.emails[0].value
                    }
                    // search for an existing user or create one
                try {
                    //  check if there is a user
                    let user = await User.findOne({ where: { google_id: profile.id } })
                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser);
                        done(null, user)
                    }
                } catch (err) {
                    done(null, false, err)
                }
            }

        ))
        // serialize the user to store inside the session
        // use the user primarykey(user)
    passport.serializeUser((user, done) => {
        done(null, { id: user.id, email: user.email, full_name: user.full_name })
    })
    passport.deserializeUser((user, done) => {
        done(null, { id: user.id, email: user.email, full_name: user.full_name })
    })

}


module.exports = initialize;