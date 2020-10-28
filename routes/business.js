const express = require('express');
const logger = require('../controllers/logger');
const Business = require('../models/Business');
const router = express.Router();

// get all business for a user
router.get('/all', async(req, res) => {
    const businesses = await Business.findAll({ where: { user: req.user.id } });
    res.status(200).json(businesses)
})

// add a business
// as of now a business its business_id, and location
// the business can have a location or not 
router.post('/', async(req, res) => {
    // first check if a business exist with the same user and business_id
    // if it does, then update it
    // post to Dericks API
    // the idea of updating is from the fact that the user can add the
    // business coordinates later
    const existingBusiness = await Business.findOne({ where: { user: req.user.id, business_id: req.body.business_id } });
    // check if there is an existing business and check if the request boxy includes the coordinates
    if (existingBusiness && req.body.latitude) {
        Business.update(req.body, {
                where: { user: req.user.id, business_id: req.body.business_id }
            })
            .then(() => {
                message = { 'message': 'Saved Business Successfylly' }
                return res.status(201).render('success', message)
            })
            .catch(err => {
                logger.error(`${req}-${err}`)
                message = {
                    'message': err || 'Some error occured while saving the records'
                }
                return res.status(500).render('500', { message })
            });
    }
    // if there is an existing bussiness and no location provided
    if (existingBusiness && !req.body.latitude) {
        message = { 'message': 'Saved Business Successfylly' }
        return res.status(200).redirect('success', message)
    }
    // if there is no existing business
    Business.create(...req.body, req.user.id)
        .then(() => {
            message = { 'message': 'Saved Business Successfylly' }
            return res.status(201).render('success', message)
        })
        .catch(err => {
            logger.error(`${req}-${err}`)
            message = {
                'message': err || 'Some error occured while saving the records'
            }
            return res.status(500).render('500', { message })
        });

})


module.exports = router;