const express = require('express')
const router = express.Router();
const ensureAuth = require('../middleware/auth')
const { Billboard } = require('../models/Billboard');

// @desc Main/Landing page
// @route GET /
router.get('/', (req, res) => {
    res.render('index')
})

// @desc Dashboard
// @route GET /
router.get('/dashboard', ensureAuth, async(req, res) => {
    try {

        res.render('dashboard', {
            layout: 'dashboard',
            name: req.user.full_name,
        })
    } catch (err) {
        console.log(err);
    }
})


module.exports = router;