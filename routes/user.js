const express = require('express');
const { addCredit } = require('../controllers/user');

const router = express.Router();

const recsRouter = require('./recs');

router.use('/:userId/recs', recsRouter);

router.get('/add-credits', addCredit);

module.exports = router;
