const express = require('express')
const router = express.Router();
const { Billboard, validateBillboard } = require('../models/Billboard')

router.get('/', async(req, res) => {
    const billBoards = await Billboard.findAll();

    res.json({ 'billboards': billBoards })
})
router.post('/', (req, res) => {
    const { error } = validateBillboard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    console.log(req.body);

    //create a new billboard
    Billboard.create(req.body)
        .then(res.status(201).send('Successful'))
        .catch(err => console.error(`Error in creation ${err}`))

})

module.exports = router;