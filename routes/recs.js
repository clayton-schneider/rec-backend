const express = require('express');
const {
  getRecs,
  getRec,
  createRec,
  updateRec,
  deleteRec,
} = require('../controllers/recs');

const router = express.Router();

router.route('/').get(getRecs).post(createRec);

router.route('/:id').get(getRec).put(updateRec).delete(deleteRec);

module.exports = router;
