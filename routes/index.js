const express = require('express')
const router = express.Router();
const { ensureAuth, ensureAuthLocal } = require('../middleware/auth')
const nodemailer = require('nodemailer');
const axios = require('axios')
const logger = require('../controllers/logger')
const Handlebars = require('handlebars')

// custom helper function to deal with json
Handlebars.registerHelper('json', (context) => {
    return JSON.stringify(context);
})

// @desc Main/Landing page
// @route GET /
router.get('/', (req, res) => {
    res.render('main', {
        apiKey: process.env.googleMapsAPIKey
    })
})

// login using local strategy
router.get('/login', (req, res) => {
    res.render('login', { layout: false })
})

router.get('/abonten', (req, res) => {
    res.render('abonten', {
        apiKey: process.env.googleMapsAPIKey,
        layout: 'eabl',
    })
})


module.exports = router;