const express = require('express');
const {
  getRecs,
  getRec,
  createRec,
  updateRec,
  deleteRec,
  sendRec,
  readFile,
} = require('../controllers/recs');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(getRecs).post(createRec);

router.route('/:id').get(getRec).put(updateRec).delete(deleteRec);

router.post('/send/:id', protect, sendRec);

router.post('/read-file', readFile);

module.exports = router;
