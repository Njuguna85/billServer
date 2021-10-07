const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");
const logger = require("../controllers/logger");
const axios = require("axios");

// use redis to cache .
// redis is an open source , in-memory data structure store
// used as a dbase, cache and msg broker
const redis = require("redis");

const client = redis.createClient();

client.on("error", (err) => {
  console.log("Redis Connect Error", err);
});

const poiCategories = [
  "bank",
  "hospital",
  "police",
  "school",
  "university",
  "bar",
  "kiosk",
  "pharmacy",
  "restaurant",
  "saloon",
  "supermarket",
  "atm",
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
};

router.get("/abonten", async (req, res) => {
  const pois = {};

  let billboards, abontenData, deliveries;
  try {
    const responseToken = await axios.post(
      "https://bi.abonten.com/oauth/token",
      {
        grant_type: "client_credentials",
        client_id: 3,
        client_secret: "69PInxj9q5sFDGAL9uBCIfG1IN5R6X1iKCSPLlrs",
      }
    );

    const responseBillboards = await axios.get(
      "https://bi.abonten.com/api/billboard/",
      {
        headers: {
          Authorization: `Bearer ${responseToken.data.access_token}`,
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "X-Requested-With",
        },
      }
    );

    billboards = responseBillboards.data;

    // const responseDeliveries = await axios.get(
    //   "https://bi.abonten.com/api/all-deliveries",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${responseToken.data.access_token}`,
    //       "Access-Control-Allow-Methods": "GET",
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Headers": "X-Requested-With",
    //     },
    //   }
    // );
    // deliveries = responseDeliveries.data.data;

    client.del("abonten", async (err, reply) => {
      if (!err) {
        if (reply === 1) {
          console.log("Key is deleted");
        } else {
          console.log("Does't exists");
        }
      }
    });

    client.get("abonten", async (err, data) => {
      if (err) {
        logger.error(`${req}-${err}`);
        console.log("Error Fetching gh redis Cache", err);

        return res.status(404).json({
          message: "Could not Fetch Abonteeh Data",
        });
      }
      if (data) {
        abontenData = JSON.parse(data);

        return res.status(200).json({
          pois: abontenData.pois,
          billboards: abontenData.billboards,
        });
      } else {
        for (const i of poiCategories) {
          pois[i] = await fetchPoi("gh", i);
        }
        client.set("abonten", JSON.stringify({ pois, billboards }));

        return res.status(200).json({
          pois,
          billboards,
          message: "cache miss",
        });
      }
    });
  } catch (error) {
    logger.error(`${req}-${error}`);
    console.log(error);

    return res.status(404).json({
      error,
    });
  }
});
//:long&/:lat
// inquire which polygon and its population details
router.get("/pop/:long/:lat", async (req, res) => {
  // get the long lat from query parameters
  // fetch all the details from db
  // if none found or if not supplied, return 404

  // run a vanila query

  // create a geometry(point) of srid 4326
  // set the srid of the column wkb_geomtry as well
  // check and get the polygon that contains the coordinates passed

  if (!req.params.long || !req.params.lat) return res.status(404);

  const ghData = await sequelize.query(
    `select
            adm2_name,
            "m0004_2020","m0509_2020","m1014_2020","m1519_2020","m2024_2020","m2529_2020","m3034_2020", "m3539_2020","m4044_2020","m4549_2020","m5054_2020", "m5559_2020","m6064_2020","m6569_2020","m7074_2020",
            "m7579_2020","m80pl_2020" , "mtotl_2020","f0004_2020", "f0509_2020",
            "f1014_2020","f1519_2020","f2024_2020","f2529_2020","f3034_2020","f3539_2020","f4044_2020","f4549_2020","f5054_2020","f5559_2020","f6064_2020","f6569_2020", "f7074_2020","f7579_2020" , "f80pl_2020",
            "ftotl_2020" ,"btotl_2020"
        from gh_pop_estimates_2020 as gh where ST_Contains( ST_SetSRID(gh.wkb_geometry,4326), ST_GeomFromText('POINT(${req.params.long} ${req.params.lat})',4326))`,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (ghData.length == 0) return res.status(404);

  const popByGender = stripPopData(ghData);

  return res.json({
    adm2_name: ghData[0]["adm2_name"],
    male: popByGender["male"],
    female: popByGender["female"],
    femaleTotal: +ghData[0]["ftotl_2020"],
    maleTotal: +ghData[0]["mtotl_2020"],
    totalPop: +ghData[0]["btotl_2020"],
  });
});

function stripPopData(ghData) {
  let malePop = [];
  let femalePop = [];

  const maleAgeGroups = [
    "m0004_2020",
    "m0509_2020",
    "m1014_2020",
    "m1519_2020",
    "m2024_2020",
    "m2529_2020",
    "m3034_2020",
    "m3539_2020",
    "m4044_2020",
    "m4549_2020",
    "m5054_2020",
    "m5559_2020",
    "m6064_2020",
    "m6569_2020",
    "m7074_2020",
    "m7579_2020",
    "m80pl_2020",
  ];

  const feAgeGroups = [
    "f0004_2020",
    "f0509_2020",
    "f1014_2020",
    "f1519_2020",
    "f2024_2020",
    "f2529_2020",
    "f3034_2020",
    "f3539_2020",
    "f4044_2020",
    "f4549_2020",
    "f5054_2020",
    "f5559_2020",
    "f6064_2020",
    "f6569_2020",
    "f7074_2020",
    "f7579_2020",
    "f80pl_2020",
  ];

  for (const ageGroup of maleAgeGroups) {
    if (ghData.length > 0) malePop.push(-Math.abs(+ghData[0][ageGroup]));
  }

  for (const ageGroup of feAgeGroups) {
    if (ghData.length > 0) femalePop.push(+ghData[0][ageGroup]);
  }

  return { male: malePop, female: femalePop };
}
module.exports = router;
