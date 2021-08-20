const express = require('express')
const router = express.Router()
const sequelize = require('../config/database');
const logger = require('../controllers/logger')
const axios = require('axios');

// use redis to cache .
// redis is an open source , in-memory data structure store 
// used as a dbase, cache and msg broker
const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => {
    console.log('Redis Connect Error', err);
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

router.get('/datalytics', async (req, res) => {
    const pois = {};

    let billboards, ugData, deliveries;
    try {
        const responseToken = await axios.post('https://bi.datalytics.co.ke/oauth/token', {
            "grant_type": "client_credentials",
            "client_id": 3,
            "client_secret": "69PInxj9q5sFDGAL9uBCIfG1IN5R6X1iKCSPLlrs"
        });

        const responseBillboards = await axios.get('https://bi.datalytics.co.ke/api/billboard/', {
            headers: {
                'Authorization': `Bearer ${responseToken.data.access_token}`,
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "X-Requested-With"
            }
        });

        billboards = responseBillboards.data;

        const responseDeliveries = await axios.get('https://bi.datalytics.co.ke/api/all-deliveries', {
            headers: {
                'Authorization': `Bearer ${responseToken.data.access_token}`,
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "X-Requested-With"
            }
        });
        deliveries = responseDeliveries.data.data;
        // client.del('datalytics', async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })

        client.get('datalytics', async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching gh redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch Datalytics Data'
                })
            }
            if (data) {
                ugData = JSON.parse(data)
                return res.status(200).json({
                    ...ugData, billboards, deliveries
                })
            } else {

                for (const i of poiCategories) {
                    pois[i] = await fetchPoi('gh', i)
                }
                client.set('datalytics', JSON.stringify({ pois }));

                return res.status(200).json({
                    pois, billboards, deliveries,
                    'message': 'cache miss'
                })

            }
        });

    } catch (error) {
        logger.error(`${req}-${error}`)
        console.log(error)

        return res.status(404).json({
            error
        })
    }
})
//:long&/:lat
// inquire which polygon and its population details
router.get('/pop/:long/:lat', async (req, res) => {
    // get the long lat from query parameters
    // fetch all the details from db
    // if none found or if not supplied, return 404

    // run a vanila query

    // create a geometry(point) of srid 4326
    // set the srid of the column wkb_geomtry as well
    // check and get the polygon that contains the coordinates passed

    if (!req.params.long || !req.params.lat) return res.status(404)

    const ugData = await sequelize.query(
        `SELECT 
            subcounty, district, male, female, total
            
        FROM 
            public.ugsubcountiesprojection as ug
        where 
            ST_Contains(st_setsrid(ug.geom, 4326),
                        st_geomfromtext('POINT(${req.params.long} ${req.params.lat})', 4326));`, { type: sequelize.QueryTypes.SELECT });

    if (ugData.length == 0) return res.status(404)

    return res.json(ugData)
})

module.exports = router;
