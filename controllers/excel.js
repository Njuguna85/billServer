const { Billboard, valdateBillboard } = require('../models/Billboard');
const XLSX = require('xlsx');
const fs = require('fs');

const expectedrows = ['billboard_id', 'route_name', 'scout_name', 'date', 'media_owner', 'select_medium', 'billboard_empty', 'customer_industry', 'customer_brand', 'site_lighting_illumination', 'zone', 'direction_from_cbd', 'size', 'orientation', 'site_run_up', 'condition', 'visibility', 'traffic', 'angle', 'photo', 'photo_long_range', 'height', 'lat', 'long', 'constituency', 'road_type'];

const upload = async(req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send('Please Upload an excel File');
        }
        let path = "./uploads/" + req.file.filename;

        const filestream = fs.createReadStream(path); // a readable stream
        const buffers = [];

        filestream.on('data', function(data) {
            buffers.push(data);
        });

        filestream.on('end', () => {
            const buffer = Buffer.concat(buffers);
            const wb = XLSX.read(buffer, { type: "buffer" });

            const j = wb.SheetNames.length;

            for (let i = 0; i < j; i++) {
                // get hold of a sheet 
                const currentSheet = wb.Sheets[wb.SheetNames[i]];

                // convert its data to a json to work with
                const jsonData = XLSX.utils.sheet_to_json(currentSheet, { raw: false, dateNF: 'mm-dd-yyyy' });

                // loop over its rows and validate its structure to that of a billboard model
                jsonData.forEach(row => {

                    // if there is an error escape and return it to the user
                    const { error } = valdateBillboard(row);

                    if (error) {
                        console.error('Validation error', error);
                        let message = JSON.stringify({
                            'Message': 'Error in the excel data',
                            'Error': error.details[0].message
                        });
                        return res.status(400).render('400', { message });

                    } else {
                        // create the new billboard
                        // but first check if the billboard exists or create one
                        Billboard.findCreateFind({
                                where: { billboard_id: row.billboard_id },
                                defaults: {...row }
                            })
                            .then(() => {
                                message = JSON.stringify({
                                    'message': 'Successful save'
                                })
                                return res.status(200).render('success', { message });
                            })
                            .catch(err => {
                                console.log('Billboard creation error', err);

                                message = JSON.stringify({
                                    'message': err || 'Some error occured while saving the records'
                                })
                                return res.status(500).render('500', { message })
                            });
                    }
                });

            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
}
module.exports = upload;