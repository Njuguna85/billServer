const bcrypt = require('bcrypt');
const User = require('../models/User');
const localStrategy = require('passport-local').Strategy
const GoogleStategy = require('passport-google-oauth20').Strategy;
const logger = require('../controllers/logger')

function initialize(passport) {
    // first we tell passport what strategy we 
    //would like to use
    passport.use('google', new GoogleStategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        proxy: true,
        callbackURL: process.env.GOOGLE_CALLACK,

    },
        // access the user details from the profile
        async (accessToken, refreshToken, profile, done) => {
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
                logger.error(`Creating or Finding a user---${err}`)
                done(null, false, err)
            }
        }

    ));

    // add local strategy
    passport.use(new localStrategy(
        function (username, password, done) {
            User.findOne({ where: { full_name: username } })
                .then((user) => {
                    if (!user) {
                        return done(null, false)
                    }
                    if (user.full_name != process.env.admin || password !== process.env.password) {
                        return done(null, false);
                    }
                    return done(null, user);
                })
                .catch((err) => {
                    return done(err)
                });
        }
    ));



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