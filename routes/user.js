const express = require('express');
const { addCredit } = require('../controllers/user');
const { protect } = require('../middleware/auth');

const router = express.Router();

const recsRouter = require('./recs');

router.use('/:userId/recs', recsRouter);

router.post('/add-credits', protect, addCredit);

module.exports = router;
