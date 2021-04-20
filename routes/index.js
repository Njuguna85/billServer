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

// @desc Dashboard
// @route GET /
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        res.render('dashboard', {
            layout: 'dashboard',
            name: req.user.full_name,
            email: req.user.email,
            apiKey: process.env.googleMapsAPIKey
        })
    } catch (err) {
        logger.error(`${req}-${err}`)
        console.log(err);
    }
})

// @desc Businesses API
// @route GET /businesses
router.get('/businesses', ensureAuth, async (req, res) => {
    try {

        // fetch for the businesses categories
        let response = await axios.get(process.env.businessesCategories);

        const { next_page_url, prev_page_url, current_page, data } = response.data;
        const paginators = { next_page_url, prev_page_url, current_page }

        res.status(200).render('businesses', {
            layout: 'businesses',
            businessesList: data,
            name: req.user.full_name,
            email: req.user.email,
            businessesAPI: process.env.businessCategoryDetails,
            apiKey: process.env.googleMapsAPIKey,
            paginators
        })

    } catch (err) {
        logger.error(`${err}-${req}`)
        message = JSON.stringify({
            'message': 'Error in accessing businesses categories'
        })
        return res.status(500).render('500', { message })
    }
});

// login using local strategy
router.get('/login', (req, res) => {
    res.render('login', { layout: false })
})

router.get('/eabl', (req, res) => {
    res.render('eabl', {
        apiKey: process.env.googleMapsAPIKey,
        layout: 'eabl'
    })
})


// african queen 
// use local strategy to redirect if no user
router.get('/aq', ensureAuthLocal, (req, res) => {
    res.render('aq', {
        apiKey: process.env.googleMapsAPIKey,
        layout: 'eabl',
    })
});

router.get('/abonteeh', (req, res) => {
    res.render('abonteh', {
        apiKey: process.env.googleMapsAPIKey,
        layout: 'eabl',
    })
})

// upload data route
router.get('/upload', ensureAuth, (req, res) => {
    res.status(200).render('upload', {
        layout: 'dashboard',
        name: req.user.full_name,
        email: req.user.email,
    })
});

// learn more route
router.get('/learn', (req, res) => {
    if (req.user) {
        return res.status(200).render('learn', {
            layout: 'dashboard',
            name: req.user.full_name,
            email: req.user.email,
        });
    }
    return res.status(200).render('learn', { layout: 'main' })
})

router.get('/contact', (req, res) => {
    if (req.user) {
        return res.status(200).render('contact', {
            layout: 'dashboard',
            name: req.user.full_name,
            email: req.user.email,
        });
    }
    return res.status(200).render('contact', { layout: 'main' })
})


// email route
router.post('/email', ensureAuth, (req, res) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }

    });

    const mailOptions = {
        from: req.body.email,
        to: 'dennix.njuguna85@gmail.com',
        subject: req.body.subject,
        text: req.body.text
    };

    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
            return res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.status(200).send('sent')
        }
    })



})


module.exports = router;