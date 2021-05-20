const express = require('express')
const router = express.Router()
const Poi = require('../models/poi')
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

router.get('/abonten', async (req, res) => {
    const pois = {};

    let billboards, abontenData;
    try {
        const responseToken = await axios.post('https://bi.abonten.com/oauth/token', {
            "grant_type": "client_credentials",
            "client_id": 3,
            "client_secret": "69PInxj9q5sFDGAL9uBCIfG1IN5R6X1iKCSPLlrs"
        });

        const responseBillboards = await axios.get('https://bi.abonten.com/api/billboard/', {
            headers: {
                'Authorization': `Bearer ${responseToken.data.access_token}`,
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "X-Requested-With"
            }
        });
        // arts

        billboards = responseBillboards.data;

        // client.del('abonten', async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })

        client.get('abonten', async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching gh redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch Abonteeh Data'
                })
            }
            if (data) {
                abontenData = JSON.parse(data)
                return res.status(200).json({
                    ...abontenData, billboards
                })
            } else {

                for (const i of poiCategories) {
                    pois[i] = await fetchPoi('gh', i)
                }
                client.set('abonten', JSON.stringify({ pois }));

                return res.status(200).json({
                    pois, billboards,
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

module.exports = router;
