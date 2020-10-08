const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc authentictae with google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc google auth callback
// @route GET /auth/google/callback
// redirection 
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    return res.status(200).redirect('/dashboard')
});

// @desc Logout user
// @route /auth/logout
router.get('/logout', (req, res) => {
    // with passport middleware, once the user logins in
    // we have a logout method
    req.logOut();
    res.redirect('/')
})

module.exports = router;