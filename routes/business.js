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
    console.log(req.body);
    const existingBusiness = await Business.findOne({
        where: {
            user: req.user.id,
            business_id: req.body.business_id,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }
    });

    // if there is no existing business
    if (existingBusiness) {
        return
    } else {
        Business.create({
                user: req.user.id,
                business_id: req.body.business_id,
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            })
            .then(() => {
                return res.status(201).message('Saved Business Successfully')
            })
            .catch(err => {
                logger.error(`${req}-${err}`)
                message = {
                    'message': err || 'Some error occured while saving the records'
                }
                return res.status(500).render('500', { message })
            });
    }

})


module.exports = router;