const express = require('express')
const router = express.Router()
const Poi = require('../models/poi')
const AQ = require('../models/africanqueenregister')
const { Billboard } = require('../models/Billboard')
const upload = require('../middleware/upload')
const excel = require('../controllers/excel')
const sequelize = require('../config/database');
const ensureAuth = require('../middleware/auth')
const { Sequelize } = require('../config/database')
const { response } = require('express')
const Nssf = require('../models/ug_nssf');

router.get('/all', ensureAuth, async (req, res) => {
    if (req.user) {
        const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
        const pois = await Poi.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] })
        const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

        res.status(200).json(billboard, pois, nssf)
    } else {
        return res.status(401).json({ 'Message': "Please sign up and enjoy more" });
    }
})

const poiCategories = [
    'bank', 'hospital', 'police', 'school', 'university',
    'bar', 'kiosk', 'pharmacy',
    'restaurant', 'saloon', 'supermarket', 'atm'
];

const fetchPoi = async (withinTable, poiColumn) => {
    return await sequelize.query(
        `SELECT a.name, ST_AsGeoJSON(a.wkb_geometry) as geojson
        FROM pois AS a
        JOIN boundaries AS b
        ON ST_WITHIN(ST_GeomFromEWKB(a.wkb_geometry), b.wkb_geometry)
        WHERE b.name = '${withinTable}' AND a.type = '${poiColumn}'`,
        { type: sequelize.QueryTypes.SELECT }
    );
}

router.get('/nairobi', async (req, res) => {
    const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

    const pois = {};

    for (const i of poiCategories) {
        pois[i] = await fetchPoi('na', i)
    }

    const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

    res.status(200).json({ pois, billboard, nssf })
})

router.get('/kenya', async (req, res) => {
    const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

    const pois = {};

    for (const i of poiCategories) {
        pois[i] = await fetchPoi('ke', i)
    }
    const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

    res.status(200).json({ pois, billboard, nssf })
})

router.get('/uganda', async (req, res) => {
    const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

    const pois = {};

    for (const i of poiCategories) {
        pois[i] = await fetchPoi('ug', i)
    }

    const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

    res.status(200).json({ pois, billboard, nssf })
})

router.get('/ghana', async (req, res) => {
    const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

    const pois = {};

    for (const i of poiCategories) {
        pois[i] = await fetchPoi('gh', i)
    }
    const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

    res.status(200).json({ pois, billboard, nssf })
})

router.get('/eabl', async (req, res) => {
    let results =  await sequelize.query(
       `SELECT 
            billboard, "brand name", "company na", 
            industry, "sub indust", billboar_1 as "billboard size", lattitude, longitude, 
            "county reg" as "county region", billboar_2 as "billboard type", billboar_3 as "billboard company", rate, "map link", 
            "image link", date, "site run_u" as "site run-up", "site light" as "site lighting", "site obstr" as "site obstruction",
            "site clust" as "site clustering", "traffic de" as "traffic density", "road name", oct_20, wkb_geometry as geom
        FROM 
            public.eabl;`,
        { type: sequelize.QueryTypes.SELECT });
    res.status(200).json(results)
})

module.exports = router;
