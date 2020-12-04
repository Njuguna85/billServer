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
const sequelize = require('../config/database');

router.get('/all', ensureAuth, async (req, res) => {
    let billboard;
    if (req.user) {
        billboard = await Billboard.findAll({ where: { user: req.user.id } })
        if (!billboard) {
            billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
        }
        const bar = await Bars.findAll({attributes: ['name', ['wkb_geometry', 'geojson']] });
        const bank = await Bank.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const atm = await Atm.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const hospital = await Hospital.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const police = await Police.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const school = await School.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const university = await University.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        // const grocery = await Grocery.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const kiosk = await Kiosk.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const pharmacy = await Pharmacy.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const restaraunt = await Restaraunt.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const saloon = await Saloon.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const supermarket = await Supermarket.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });
        const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

        res.json({
            billboard,
            atm,
            bank,
            bar,
            hospital,
            police,
            school,
            university,
            // grocery,
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
router.get('/', async (req, res) => {
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
            'name', ['wkb_geometry', 'geojson']
        ]
    })

    const atm = await Atm.findAll({
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
        hospital,
        police,
        school,
        university,
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
router.post('/upload', ensureAuth, upload.single('xlsFile'), excel, (req, res) => { })

// raw query for postgis within function
router.get('/nairobi', async (req, res) => {

    const atm = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from atms as a
        join nairobisublocations as b
        on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        { type: sequelize.QueryTypes.SELECT }
    );

    const billboard = await Billboard.findAll({
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
    });

    const bank = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from banks as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const bar = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from bars as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const hospital = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from hospitals as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const police = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from police_post as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const school = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from schools as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const university = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from universities as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const kiosk = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from kiosks as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const pharmacy = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from pharmacy as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const restaraunt = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from restaurant as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const supermarket = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from supermarket as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const saloon = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from saloon as a
        join nairobisublocations as b
         on ST_WITHIN(a.wkb_geometry, ST_GeomFromWKB(b.wkb_geometry,4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

    res.status(200).json({
        billboard,
        atm,
        bank,
        bar,
        hospital,
        police,
        school,
        university,
        kiosk,
        pharmacy,
        restaraunt,
        saloon,
        supermarket,
        nssf
    });
});

router.get('/kenya', async (req, res) => {

    const atm = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from atms as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        { type: sequelize.QueryTypes.SELECT }
    );

    const billboard = await Billboard.findAll({
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
    });

    const bank = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from banks as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const bar = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from bars as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const hospital = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from hospitals as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const police = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from police_post as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const school = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from schools as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const university = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from universities as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const kiosk = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from kiosks as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const pharmacy = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from pharmacy as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const restaraunt = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from restaurant as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const supermarket = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from supermarket as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const saloon = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from saloon as a
        join kenya_sublocations as b
        on ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

    res.status(200).json({
        billboard,
        atm,
        bank,
        bar,
        hospital,
        police,
        school,
        university,
        kiosk,
        pharmacy,
        restaraunt,
        saloon,
        supermarket,
        nssf
    });
})

router.get('/uganda', async (req, res) => {

    const atm = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from atms as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        { type: sequelize.QueryTypes.SELECT }
    );

    const billboard = await Billboard.findAll({
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
    });

    const bank = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from banks as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const bar = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from bars as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const hospital = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from hospitals as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const police = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from police_post as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const school = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from schools as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const university = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from universities as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const kiosk = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from kiosks as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const pharmacy = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from pharmacy as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const restaraunt = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from restaurant as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const supermarket = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from supermarket as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const saloon = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from saloon as a
        join ugsubcountiesprojection as b
        on ST_WITHIN(a.wkb_geometry, b.geom)`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

    res.status(200).json({
        billboard,
        atm,
        bank,
        bar,
        hospital,
        police,
        school,
        university,
        kiosk,
        pharmacy,
        restaraunt,
        saloon,
        supermarket,
        nssf
    });

})

router.get('/ghana', async (req, res) => {

    const atm = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from atms as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        { type: sequelize.QueryTypes.SELECT }
    );

    const billboard = await Billboard.findAll({
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
    });

    const bank = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from banks as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const bar = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from bars as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const hospital = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from hospitals as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const police = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from police_post as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const school = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from schools as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const university = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from universities as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const kiosk = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from kiosks as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const pharmacy = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from pharmacy as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const restaraunt = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from restaurant as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const supermarket = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from supermarket as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );

    const saloon = await sequelize.query(
        `select a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        from saloon as a
        join ghanapopulation as b
        on ST_WITHIN(a.wkb_geometry, ST_SetSRID(b.wkb_geometry, 4326))`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
    const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

    res.status(200).json({
        billboard,
        atm,
        bank,
        bar,
        hospital,
        police,
        school,
        university,
        kiosk,
        pharmacy,
        restaraunt,
        saloon,
        supermarket,
        nssf
    });
})

module.exports = router;