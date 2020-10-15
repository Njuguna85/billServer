const express = require('express')
const router = express.Router();
const ensureAuth = require('../middleware/auth');
const User = require('../models/User')
const Role = require('../models/Role')

// Role Management routes

//get all users with their Roles
router.get('/users', async(req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['google_id', 'image', 'createdAt', 'updatedAt', ] }
    })
    users.forEach(async user => {
        const role = await Role.findByPk(user.role)
        user.adminLevel = role.type;
    });


    res.status(200).send(users)

});

// get all data available
router.get('/data', (req, res) => {
    const data = [
        { 'African Queen': 'Required Permissions' },
        { 'Atms': 'No Permission Required' },
        { 'Atms': 'No Permission Required' },
        { 'Banks': 'No Permission Required' },
        { 'Billboards': 'No Permission Required, On user demand' },
        { 'Fuel': 'No Permission Required' },
        { 'Ghana Population': 'No Permission Required' },
        { 'Grocery': 'No Permission Required' },
        { 'Hospitals': 'No Permission Required' },
        { 'Kibera Administration Boundary': 'No Permission Required' },
        { 'Kiosks': 'No Permission Required' },
        { 'Mathare Administration Boundary': 'No Permission Required' },
        { 'Nairobi SubCounties Census Data': 'No Permission Required' },
        { 'Nairobi Sublocations Census Data': 'No Permission Required' },
        { 'Pharamacy': 'No Permission Required' },
        { 'Police Posts': 'No Permission Required' },
        { 'Restaurants': 'No Permission Required' },
        { 'Saloons': 'No Permission Required' },
        { 'Schools': 'No Permission Required' },
        { 'Supermarkets': 'No Permission Required' },
        { 'Uber Travel Speeds': 'No Permission Required' },
        { 'Uganda NSSF Offices': 'No Permission Required' },
        { 'Uganda Subcounties Census Data': 'No Permission Required' },
        { 'Uganda Subcounties Population Projection': 'No Permission Required' },
        { 'Universities': 'No Permission Required' },
    ]
});

module.exports = router;