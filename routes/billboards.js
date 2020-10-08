const express = require('express')
const router = express.Router();
const { Billboard } = require('../models/Billboard')
const AQ = require('../models/africanqueenregister')
const Atm = require('../models/atms')
const Fuel = require('../models/fuel')
const Bars = require('../models/bars');
const Bank = require('../models/banks');
const Hospital = require('../models/hospitals');
const Police = require('../models/police_post');
const School = require('../models/schools');
const University = require('../models/universities');
const Grocery = require('../models/grocery');
const Kiosk = require('../models/kiosks');
const Pharmacy = require('../models/pharmacy');
const Restaraunt = require('../models/restaurant');
const Saloon = require('../models/saloon');
const Supermarket = require('../models/supermarket');
const Nssf = require('../models/ug_nssf');
const ensureAuth = require('../middleware/auth');
const upload = require('../middleware/upload')
const excel = require('../controllers/excel')

router.get('/all', ensureAuth, async(req, res) => {
    let billboards;
    if (req.user) {
        billboards = await Billboard.findAll({ where: { user: req.user.id } })
        if (!billboards) {
            billboards = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
        }
        const bar = await Bars.findAll({ limit: 200, attributes: ['name', ['wkb_geometry', 'geojson']] });
        const bank = await Bank.findAll({ attributes: ['atm', 'name', ['wkb_geometry', 'geojson']] });
        const atm = await Atm.findAll({ attributes: ['name', 'operator', ['wkb_geometry', 'geojson']] });
        const fuel = await Fuel.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const hospital = await Hospital.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const police = await Police.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const school = await School.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const university = await University.findAll({ attributes: ['name', ['geom', 'geojson']] });
        const grocery = await Grocery.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const kiosk = await Kiosk.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const pharmacy = await Pharmacy.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const restaraunt = await Restaraunt.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const saloon = await Saloon.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const supermarket = await Supermarket.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

        res.json({
            billboards,
            atm,
            bank,
            bar,
            fuel,
            hospital,
            police,
            school,
            university,
            grocery,
            kiosk,
            pharmacy,
            restaraunt,
            saloon,
            supermarket,
            nssf
        });
    } else {
        return res.status(401).json({ 'Message': "Please sign up and enjoy more" });
    }
});

// get all locational data
router.get('/', async(req, res) => {
    const billboard = await Billboard.findAll({
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
    });

    const bar = await Bars.findAll({ limit: 200, attributes: ['name', ['wkb_geometry', 'geojson']] });

    // const aq = await AQ.findAll({
    //     limit: 200,
    //     attributes: [
    //         'customer_n', 'customer_t', 'address_1', 'address_2', 'latitude', 'longitude', 'customer_1', 'created_da', 'gt_country', 'bt_territo', 'bt_area', 'bt_town', 'cs_chanel', 'cs_type_of', ['wkb_geometry', 'geojson']
    //     ]
    // });

    const bank = await Bank.findAll({
        limit: 200,
        attributes: [
            'atm', 'name', ['wkb_geometry', 'geojson']
        ]
    })

    const atm = await Atm.findAll({
        limit: 200,
        attributes: [
            'name', 'operator', ['wkb_geometry', 'geojson']
        ]
    });

    const fuel = await Fuel.findAll({
        limit: 200,
        attributes: [
            'name', ['wkb_geometry', 'geojson']
        ]
    });

    const hospital = await Hospital.findAll({
        limit: 200,
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const police = await Police.findAll({
        limit: 200,
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const school = await School.findAll({
        limit: 200,
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const university = await University.findAll({
        attributes: ['name', ['geom', 'geojson']]
    })

    const grocery = await Grocery.findAll({
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const kiosk = await Kiosk.findAll({
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const pharmacy = await Pharmacy.findAll({
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const restaraunt = await Restaraunt.findAll({
        limit: 200,
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const saloon = await Saloon.findAll({
        limit: 200,
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const supermarket = await Supermarket.findAll({
        limit: 200,
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    const nssf = await Nssf.findAll({
        limit: 200,
        attributes: ['name', ['wkb_geometry', 'geojson']]
    })

    res.json({
        billboard,
        atm,
        bank,
        bar,
        fuel,
        hospital,
        police,
        school,
        university,
        grocery,
        kiosk,
        pharmacy,
        restaraunt,
        saloon,
        supermarket,
        nssf
    });
})

// upload an excel file and read it with xlsx
// responsense will be handled by excel contoller
router.post('/upload', ensureAuth, upload.single('xlsFile'), excel, (req, res) => {})

module.exports = router;