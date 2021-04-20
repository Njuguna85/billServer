const express = require('express')
const router = express.Router()
const Poi = require('../models/poi')
const AQ = require('../models/africanqueenregister')
const { Billboard } = require('../models/Billboard')
const upload = require('../middleware/upload')
const excel = require('../controllers/excel')
const sequelize = require('../config/database');
const ensureAuth = require('../middleware/auth')
const Nssf = require('../models/ug_nssf');
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

router.get('/all', async (req, res) => {
    const all = 'all';
    // if (req.user) {
    try {
        // client.del(all, async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })
        // since we using redis lets try to retrieve from cache 
        client.get(all, async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching all redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch all Data'
                })
            }

            if (data) {
                return res.status(200).send(
                    JSON.parse(data))

            } else {
                const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
                // poi is a heavy table with all the points data
                // fetch its name and geojson
                const pois = await Poi.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] })
                const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

                client.set(all, JSON.stringify({ billboard, pois, nssf }))

                return res.status(200).json({
                    billboard, pois, nssf,
                    'message': 'cache miss'
                })
            }
        })
    } catch (error) {
        logger.error(`${req}-${error}`)
        console.log(error)

        return res.status(404).json({
            'message': 'Could not Fetch all Data'
        })
    }
    // } else {
    //     return res.status(401).json({ 'Message': "Please sign up and enjoy more" });
    // }
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
    const nairobi = 'nairobi';
    try {
        // client.del(nairobi, async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })
        client.get(nairobi, async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching na redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch Nairobi Data'
                })
            }

            if (data) {
                return res.status(200).send(JSON.parse(data))
            } else {
                // struct to store all pois 
                // eg key=> 'bar, value=> ['bars']
                const pois = {};

                const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

                for (const i of poiCategories) {
                    pois[i] = await fetchPoi('na', i)
                }

                const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

                // save it to cache with a key of nairobi
                client.set(nairobi, JSON.stringify({ pois, billboard, nssf }));

                return res.status(200).json({
                    pois, billboard, nssf,
                    'message': 'cache miss'
                })
            }
        });

    } catch (error) {
        logger.error(`${req}-${error}`)
        console.log(error)

        return res.status(404).json({
            'message': 'Could not Fetch Nairobi Data'
        })
    }
})

router.get('/kenya', async (req, res) => {
    const kenya = 'kenya';
    try {
        // client.del(kenya, async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })
        client.get(kenya, async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching ke redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch Kenya Data'
                })
            }

            if (data) {
                return res.status(200).send(
                    JSON.parse(data))

            } else {
                const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

                const pois = {};

                for (const i of poiCategories) {
                    pois[i] = await fetchPoi('ke', i)
                }
                const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

                client.set(kenya, JSON.stringify({ billboard, pois, nssf }))

                return res.status(200).json({ pois, billboard, nssf })
            }
        })

    } catch (error) {
        logger.error(`${req}-${error}`)
        console.log(error)

        return res.status(404).json({
            'message': 'Could not Fetch Kenya Data'
        })
    }
})

router.get('/uganda', async (req, res) => {
    const uganda = 'uganda';
    try {
        // client.del(uganda, async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })
        client.get(uganda, async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching ug redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch Uganda Data'
                })
            }

            if (data) {
                return res.status(200).send(JSON.parse(data))
            } else {
                // struct to store all pois 
                // eg key=> 'bar, value=> ['bars']
                const pois = {};

                const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

                for (const i of poiCategories) {
                    pois[i] = await fetchPoi('ug', i)
                }

                const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

                // save it to cache with a key of nairobi
                client.set(uganda, JSON.stringify({ pois, billboard, nssf }));

                return res.status(200).json({
                    pois, billboard, nssf,
                    'message': 'cache miss'
                })
            }
        });

    } catch (error) {
        logger.error(`${req}-${error}`)
        console.log(error)

        return res.status(404).json({
            'message': 'Could not Fetch Uganda Data'
        })
    }
})

router.get('/ghana', async (req, res) => {
    const ghana = 'ghana';
    try {
        // client.del(ghana, async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })
        client.get(ghana, async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching gh redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch Ghana Data'
                })
            }

            if (data) {
                return res.status(200).send(JSON.parse(data))
            } else {
                // struct to store all pois 
                // eg key=> 'bar, value=> ['bars']
                const pois = {};

                const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

                for (const i of poiCategories) {
                    pois[i] = await fetchPoi('gh', i)
                }

                const nssf = await Nssf.findAll({ attributes: ['name', ['wkb_geometry', 'geojson']] });

                // save it to cache with a key of nairobi
                client.set(ghana, JSON.stringify({ pois, billboard, nssf }));

                return res.status(200).json({
                    pois, billboard, nssf,
                    'message': 'cache miss'
                })
            }
        });

    } catch (error) {
        logger.error(`${req}-${error}`)
        console.log(error)

        return res.status(404).json({
            'message': 'Could not Fetch Ghana Data'
        })
    }

})

router.get('/eabl', async (req, res) => {
    const eabl = 'eabl';
    try {
        // client.del(eabl, async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })
        client.get(eabl, async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching eabl redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch EABL Data'
                })
            }

            if (data) {
                return res.status(200).send(JSON.parse(data))
            } else {
                let results = await sequelize.query(
                    `SELECT 
                        billboard as "billboard sites" , "brand name", "company na" as "company name", 
                        industry, "sub indust" as "sub industry", billboar_1 as "billboard size", lattitude, longitude, 
                        "county reg" as "county region", billboar_2 as "billboard type", billboar_3 as "billboard company", rate, "map link", 
                        "image link", date, "site run_u" as "site run-up", "site light" as "site lighting", "site obstr" as "site obstruction",
                        "site clust" as "site clustering", "traffic de" as "traffic density", "road name", oct_20, wkb_geometry as geom
                    FROM 
                        public."EABL";`,
                    { type: sequelize.QueryTypes.SELECT });

                client.set(eabl, JSON.stringify(results));

                return res.status(200).json(results)
            }
        });

    } catch (error) {
        logger.error(`${req}-${error}`)
        console.log(error)

        return res.status(404).json({
            'message': 'Could not Fetch EABL Data'
        })
    }
})

// african queen
router.get('/aq', async (req, res) => {
    try {
        // client.del('aq', async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })

        client.get('aq', async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching all redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch AQ Data'
                })
            }

            if (data) {
                return res.status(200).send(JSON.parse(data))

            } else {
                const pois = {};

                const aq = await AQ.findAll({ attributes: { exclude: ['wkb_geometry'] } });

                const billboard = await Billboard.findAll({ attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });

                for (const i of poiCategories) {
                    pois[i] = await fetchPoi('ug', i)
                }

                client.set('aq', JSON.stringify({ aq, pois, billboard }))

                return res.status(200).json({ aq, pois, billboard, 'message': 'cache miss' })
            }
        });
    } catch (error) {
        logger.error(`${req}-${error}`)
        console.log(error)

        return res.status(404).json({
            'message': 'Could not Fetch AQ Data'
        })
    }
});

router.get('/abonteh', async (req, res) => {
    const pois = {};
    const now = new Date().getTime();
    let billboards, abonteehData;
    try {
        const responseToken = await axios.post('https://bi.predictiveanalytics.co.ke/oauth/token', {
            "grant_type": "client_credentials",
            "client_id": 5,
            "client_secret": "yTwrMoZTsKuqkPsDSJAq3w4X1JcvLt1YKhYMayZV"
        });

        const responseBillboards = await axios.get('https://bi.predictiveanalytics.africa/api/billboard/', {
            headers: {
                'Authorization': `Bearer ${responseToken.data.access_token}`
            }
        });

        billboards = responseBillboards.data;

        // client.del('abonteh', async (err, reply) => {
        //     if (!err) {
        //         if (reply === 1) {
        //             console.log("Key is deleted");
        //         } else {
        //             console.log("Does't exists");
        //         }
        //     }
        // })

        client.get('abonteh', async (err, data) => {
            if (err) {
                logger.error(`${req}-${err}`)
                console.log('Error Fetching gh redis Cache', err)

                return res.status(404).json({
                    'message': 'Could not Fetch Abonteeh Data'
                })
            }
            if (data) {
                abonteehData = JSON.parse(data)
                return res.status(200).json({
                    ...abonteehData
                })
            } else {

                for (const i of poiCategories) {
                    pois[i] = await fetchPoi('gh', i)
                }
                client.set('abonteh', JSON.stringify({ pois }));

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
